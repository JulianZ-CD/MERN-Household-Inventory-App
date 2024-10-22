import express from "express";
import mongoose from "mongoose";
import { InventoryModel } from "../models/Inventory.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await InventoryModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new inventory
router.post("/", verifyToken, async (req, res) => {
  const inventory = new InventoryModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    expiryDate: req.body.expiryDate,
    userOwner: req.body.userOwner,
  });
  console.log(inventory);

  try {
    const result = await inventory.save();
    res.status(201).json({
      createdInventory: {
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

// Get an inventory by ID
router.get("/:inventoryId", async (req, res) => {
  try {
    const result = await InventoryModel.findById(req.params.inventoryId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save an inventory
router.put("/", async (req, res) => {
  const inventory = await InventoryModel.findById(req.body.inventoryId);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedInventory.push(inventory);
    await user.save();
    res.status(201).json({ savedInventory: user.savedInventory });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved inventory
router.get("/savedInventory/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedInventory: user?.savedInventory });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved inventory
router.get("/savedInventory/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedInventory = await InventoryModel.find({
      _id: { $in: user.savedInventory },
    });

    console.log(savedInventory);
    res.status(201).json({ savedInventory });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update an inventory item
router.put("/:inventoryId", verifyToken, async (req, res) => {
  try {
    const inventory = await InventoryModel.findById(req.params.inventoryId);
    
    // Check if inventory exists
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Check if user is the owner
    if (inventory.userOwner.toString() !== req.body.userOwner) {
      return res.status(403).json({ message: "User is not authorized to update this inventory item" });
    }

    // Update inventory fields
    const updatedInventory = await InventoryModel.findByIdAndUpdate(
      req.params.inventoryId,
      {
        name: req.body.name,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        imageUrl: req.body.imageUrl,
        expiryDate: req.body.expiryDate
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedInventory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete an inventory item
router.delete("/:inventoryId", verifyToken, async (req, res) => {
  try {
    const inventory = await InventoryModel.findById(req.params.inventoryId);
    
    // Check if inventory exists
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Check if user is the owner
    if (inventory.userOwner.toString() !== req.body.userOwner) {
      return res.status(403).json({ message: "User is not authorized to delete this inventory item" });
    }

    // Delete the inventory item
    await InventoryModel.findByIdAndDelete(req.params.inventoryId);

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as inventoryRouter };
