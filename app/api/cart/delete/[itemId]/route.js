import mongoose from 'mongoose';
import Cart from "@/models/Cart";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    await connectDB();

    try {
        const { itemId } = await params;

        // Check if itemId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return NextResponse.json(
                { status: "failed", message: "Invalid item ID!" },
                { status: 400 }
            );
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { "items._id": itemId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        )

        if (!updatedCart) {
            return NextResponse.json(
                { status: "failed", message: "Item not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { status: "success", message: "Item deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete process:", error);
        return NextResponse.json(
            { status: "failed", message: "Error in deleting item!" },
            { status: 500 }
        );
    }
}
