import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export const RecipeList = ({ recipes, setRecipes, savedRecipes, userID, onSaveRecipe }) => {
  const [cookies, _] = useCookies(["access_token"]);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      onSaveRecipe(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const unsaveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes/unsave", {
        recipeID,
        userID,
      });
      onSaveRecipe(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveToggle = (recipeID) => {
    if (isRecipeSaved(recipeID)) {
      unsaveRecipe(recipeID);
    } else {
      saveRecipe(recipeID);
    }
  };

  const checkOwnership = (recipe) => {
    return recipe.userOwner === userID;
  };

  const deleteRecipe = async (recipeID) => {
    try {
      const recipe = recipes.find(r => r._id === recipeID);
      if (!checkOwnership(recipe)) {
        alert("Only the recipe owner can delete this recipe");
        return;
      }

      const confirm = window.confirm("Are you sure you want to delete this recipe?");
      if(!confirm) return;

      await axios.delete(`http://localhost:3001/recipes/${recipeID}`, {
        headers: { authorization: cookies.access_token },
        data: { userOwner: userID }
      });
      
      setRecipes(recipes.filter(recipe => recipe._id !== recipeID));
      alert("Recipe deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (recipe) => {
    if (!checkOwnership(recipe)) {
      alert("Only the recipe owner can edit this recipe");
      return;
    }
    setEditingRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients]
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3001/recipes/${editingRecipe._id}`,
        {
          ...editingRecipe,
          userOwner: userID
        },
        {
          headers: { authorization: cookies.access_token }
        }
      );

      setRecipes(recipes.map(recipe => 
        recipe._id === editingRecipe._id ? editingRecipe : recipe
      ));
      
      setEditingRecipe(null);
      alert("Recipe updated successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            {editingRecipe && editingRecipe._id === recipe._id ? (
              // edit view
              <div>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editingRecipe.name}
                    onChange={(e) => setEditingRecipe({
                      ...editingRecipe,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Instructions:</label>
                  <textarea
                    value={editingRecipe.instructions}
                    onChange={(e) => setEditingRecipe({
                      ...editingRecipe,
                      instructions: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Cooking Time (minutes):</label>
                  <input
                    type="number"
                    value={editingRecipe.cookingTime}
                    onChange={(e) => setEditingRecipe({
                      ...editingRecipe,
                      cookingTime: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Image URL:</label>
                  <input
                    type="text"
                    value={editingRecipe.imageUrl}
                    onChange={(e) => setEditingRecipe({
                      ...editingRecipe,
                      imageUrl: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label>Ingredients:</label>
                  {editingRecipe.ingredients.map((ingredient, index) => (
                    <input
                      key={index}
                      type="text"
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [...editingRecipe.ingredients];
                        newIngredients[index] = e.target.value;
                        setEditingRecipe({
                          ...editingRecipe,
                          ingredients: newIngredients
                        });
                      }}
                    />
                  ))}
                  <button onClick={() => {
                    setEditingRecipe({
                      ...editingRecipe,
                      ingredients: [...editingRecipe.ingredients, ""]
                    });
                  }}>Add Ingredient</button>
                </div>
                <button onClick={handleUpdate}>Save Changes</button>
                <button onClick={() => setEditingRecipe(null)}>Cancel</button>
              </div>
            ) : (
              // normal view
              <div>
                <div>
                  <h2>{recipe.name}</h2>
                  <button onClick={() => handleSaveToggle(recipe._id)}>
                    {isRecipeSaved(recipe._id) ? "Unsave" : "Save"}
                  </button>
                  <button 
                    onClick={() => handleEdit(recipe)}
                    disabled={!checkOwnership(recipe)}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteRecipe(recipe._id)}
                    disabled={!checkOwnership(recipe)}
                  >
                    Delete
                  </button>
                </div>
                <div>
                  <p>{recipe.instructions}</p>
                </div>
                { recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.name} />
                )}
                <p>Cooking Time: {recipe.cookingTime} minutes</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};