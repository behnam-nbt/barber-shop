import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, required: true },
    role: { type: String, },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
