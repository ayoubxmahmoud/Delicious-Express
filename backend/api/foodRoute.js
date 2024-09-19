import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

// Create a new router instance
const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination:"uploads",
    //Define the filename format for uploaded files
    filename:(req,file,cb) => {
        // Use the current timestamp and original file name
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})
// Define the route to add a new food item
foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.post("/remove", removeFood)
foodRouter.get("/list", listFood)


export default foodRouter;