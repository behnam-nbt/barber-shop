import Like from "@/models/Like";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await connectDB();
        const { itemId, quantity } = await req.json(); // itemId (like item id), quantity (new quantity)

        if (!itemId || !quantity || quantity < 1) {
            return NextResponse.json({ message: "Invalid item ID or quantity" }, { status: 400 });
        }

        // Find the like with the specified itemId
        const like = await Like.findOne({ "items._id": new mongoose.Types.ObjectId(itemId) });

        if (!like) {
            return NextResponse.json({ message: "like or item not found" }, { status: 404 });
        }

        // Find the index of the item to update
        const itemIndex = like.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return NextResponse.json({ message: "Item not found in like" }, { status: 404 });
        }

        // Update the quantity of the item
        like.items[itemIndex].quantity = quantity;

        // Save the updated like
        await like.save();

        return NextResponse.json({ message: "like updated successfully", like }, { status: 200 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
