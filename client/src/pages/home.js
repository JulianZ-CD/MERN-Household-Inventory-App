import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { RecipeList } from "../components/recipeList";
import { InventoryList } from "../components/inventoryList";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [inventories, setInventories] = useState([]); 

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchInventories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/inventory");
        setInventories(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchInventories();
    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  return (
    <div>
      <InventoryList 
        inventories={inventories} 
        setInventories={setInventories}
        userID={userID}
      />
      <RecipeList 
        recipes={recipes} 
        setRecipes={setRecipes}
        savedRecipes={savedRecipes}
        userID={userID}
        onSaveRecipe={setSavedRecipes}
      />
    </div>
  );
};