import mongoose from "mongoose";

const inventorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: false,
    },
  ],
  instructions: {
    type: String,
    required: false,
  },

  imageUrl: {
    type: String,
    required: false,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const InventoryModel = mongoose.model("Inventory", inventorySchema);
