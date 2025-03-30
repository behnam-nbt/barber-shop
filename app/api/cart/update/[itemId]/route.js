import Cart from "@/models/Cart";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await connectDB();
        const { itemId, quantity } = await req.json(); // itemId (cart item id), quantity (new quantity)

        if (!itemId || !quantity || quantity < 1) {
            return NextResponse.json({ message: "Invalid item ID or quantity" }, { status: 400 });
        }

        // Find the cart with the specified itemId
        const cart = await Cart.findOne({ "items._id": new mongoose.Types.ObjectId(itemId) });

        if (!cart) {
            return NextResponse.json({ message: "Cart or item not found" }, { status: 404 });
        }

        // Find the index of the item to update
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
        }

        // Update the quantity of the item
        cart.items[itemIndex].quantity = quantity;

        // Save the updated cart
        await cart.save();

        return NextResponse.json({ message: "Cart updated successfully", cart }, { status: 200 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
