// components/InventoryList.js
import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export const InventoryList = ({ inventories, setInventories, userID }) => {
  const [cookies, _] = useCookies(["access_token"]);
  const [editingInventory, setEditingInventory] = useState(null);

  const checkOwnership = (inventory) => {
    return inventory.userOwner === userID;
  };

  const deleteInventory = async (inventoryID) => {
    try {
      const inventory = inventories.find(i => i._id === inventoryID);
      if (!checkOwnership(inventory)) {
        alert("Only the inventory owner can delete this item");
        return;
      }

      const confirm = window.confirm("Are you sure you want to delete this inventory item?");
      if(!confirm) return;

      await axios.delete(`http://localhost:3001/inventory/${inventoryID}`, {
        headers: { authorization: cookies.access_token },
        data: { userOwner: userID }
      });
      
      setInventories(inventories.filter(inventory => inventory._id !== inventoryID));
      alert("Inventory item deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (inventory) => {
    if (!checkOwnership(inventory)) {
      alert("Only the inventory owner can edit this item");
      return;
    }
    setEditingInventory({
      ...inventory,
      ingredients: [...inventory.ingredients]
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3001/inventory/${editingInventory._id}`,
        {
          ...editingInventory,
          userOwner: userID
        },
        {
          headers: { authorization: cookies.access_token }
        }
      );

      setInventories(inventories.map(inventory => 
        inventory._id === editingInventory._id ? editingInventory : inventory
      ));
      
      setEditingInventory(null);
      alert("Inventory item updated successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Inventories</h1>
      <ul>
        {inventories.map((inventory) => (
          <li key={inventory._id}>
            {editingInventory && editingInventory._id === inventory._id ? (
              // edit view
              <div>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editingInventory.name}
                    onChange={(e) => setEditingInventory({
                      ...editingInventory,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={editingInventory.description}
                    onChange={(e) => setEditingInventory({
                      ...editingInventory,
                      description: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Instructions:</label>
                  <textarea
                    value={editingInventory.instructions}
                    onChange={(e) => setEditingInventory({
                      ...editingInventory,
                      instructions: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Image URL:</label>
                  <input
                    type="text"
                    value={editingInventory.imageUrl}
                    onChange={(e) => setEditingInventory({
                      ...editingInventory,
                      imageUrl: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Expiry Date:</label>
                  <input
                    type="date"
                    value={new Date(editingInventory.expiryDate).toISOString().split('T')[0]}
                    onChange={(e) => setEditingInventory({
                      ...editingInventory,
                      expiryDate: new Date(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <label>Ingredients:</label>
                  {editingInventory.ingredients.map((ingredient, index) => (
                    <input
                      key={index}
                      type="text"
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [...editingInventory.ingredients];
                        newIngredients[index] = e.target.value;
                        setEditingInventory({
                          ...editingInventory,
                          ingredients: newIngredients
                        });
                      }}
                    />
                  ))}
                  <button onClick={() => {
                    setEditingInventory({
                      ...editingInventory,
                      ingredients: [...editingInventory.ingredients, ""]
                    });
                  }}>Add Ingredient</button>
                </div>
                <button onClick={handleUpdate}>Save Changes</button>
                <button onClick={() => setEditingInventory(null)}>Cancel</button>
              </div>
            ) : (
              // normal view
              <div>
                <div>
                  <h2>{inventory.name}</h2>
                  <button 
                    onClick={() => handleEdit(inventory)}
                    disabled={!checkOwnership(inventory)}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteInventory(inventory._id)}
                    disabled={!checkOwnership(inventory)}
                  >
                    Delete
                  </button>
                </div>
                <div>
                  <p>{inventory.description}</p>
                </div>
                {inventory.instructions && (
                  <div>
                    <p>{inventory.instructions}</p>
                  </div>
                )}
                {inventory.imageUrl && (
                    <img src={inventory.imageUrl} alt={inventory.name} />
                )}
                <p>Expiry Date: {new Date(inventory.expiryDate).toLocaleDateString()}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};