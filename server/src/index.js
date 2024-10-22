import express from "express";
import cors from "cors";
import mongoose from "mongoose";  // 5x58ICENeegconiv
import { userRouter } from "./routes/user.js";
import { inventoryRouter } from "./routes/inventory.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());  // get data from front end in a simple way
app.use(cors());  // enable cross-origin requests

app.use("/auth", userRouter);
app.use("/inventory", inventoryRouter)
app.use("/recipes", recipesRouter);

mongoose.connect(
  "mongodb+srv://JuZ-mern:5x58ICENeegconiv@household-inventory.pt1lh.mongodb.net/Household-inventory?retryWrites=true&w=majority&appName=Household-inventory",
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);

app.listen(3001, () => console.log("Server started!"));  // API run on 3001 (front on 3000)
