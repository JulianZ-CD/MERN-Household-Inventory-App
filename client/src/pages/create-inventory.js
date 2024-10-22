import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateInventory = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [inventory, setInventory] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    expiryDate: "",
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInventory({ ...inventory, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...inventory.ingredients];
    ingredients[index] = value;
    setInventory({ ...inventory, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...inventory.ingredients, ""];
    setInventory({ ...inventory, ingredients });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/inventory",
        { ...inventory },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Inventory Created");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-inventory">
      <h2>Create Inventory</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={inventory.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={inventory.description}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="ingredients">Ingredients</label>
        {inventory.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, index)}
          />
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={inventory.instructions}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={inventory.imageUrl}
          onChange={handleChange}
        />
        <label htmlFor="expiryDate">Expiry Date</label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={inventory.expiryDate}
          onChange={handleChange}
        />
        <button type="submit">Create Inventory</button>
      </form>
    </div>
  );
};
