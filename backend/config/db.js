import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ayoubx1:ayoubx111@cluster0.pyb6n.mongodb.net/food_del_db')
                    .then(() => console.log("DB Connected"));
}