import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Unsave a Recipe
router.put("/unsave", async (req, res) => {
  try {
    const { recipeID, userID } = req.body;
    const user = await UserModel.findById(userID);
    
    // 从 savedRecipes 数组中移除该 recipe
    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeID);
    
    await user.save();
    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update a recipe by ID
router.put("/:recipeId", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    
    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
 
    // Check if user is the owner of the recipe
    if (recipe.userOwner.toString() !== req.body.userOwner) {
      return res.status(403).json({ message: "User is not authorized to update this recipe" });
    }
 
    // Update recipe fields
    const updatedRecipe = await RecipesModel.findByIdAndUpdate(
      req.params.recipeId,
      {
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        imageUrl: req.body.imageUrl,
        cookingTime: req.body.cookingTime
      },
      { new: true } // Return the updated document
    );
 
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json(err);
  }
 });
 
 // Delete a recipe by ID
 router.delete("/:recipeId", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    
    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
 
    // Check if user is the owner of the recipe
    if (recipe.userOwner.toString() !== req.body.userOwner) {
      return res.status(403).json({ message: "User is not authorized to delete this recipe" });
    }
 
    // Remove recipe from user's saved recipes
    await UserModel.updateMany(
      { savedRecipes: recipe._id },
      { $pull: { savedRecipes: recipe._id } }
    );
 
    // Delete the recipe
    await RecipesModel.findByIdAndDelete(req.params.recipeId);
 
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
 }); 

export { router as recipesRouter };
