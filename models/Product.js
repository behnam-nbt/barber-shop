import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    tags: { type: [String], default: [] },
    description: { type: String },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
