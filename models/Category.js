import mongoose, { model, models, Schema } from "mongoose";

const categorySchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const Category = models.Category || model("Category", categorySchema);

export default Category;