import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import Like from "@/models/Like";

// Handle POST request (Add to Like)
export async function POST(req) {
    try {
        await connectDB();
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || !quantity) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Find or create like
        let like = await Like.findOne({ userId });

        if (!like) {
            like = new Like({ userId, items: [] });
        }

        // Check if product exists in like
        const existingItem = like.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            like.items.push({ productId, quantity });
        }

        await like.save();
        return NextResponse.json({ message: "Product added to like", like }, { status: 200 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// Handle GET request (Fetch like items)
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        // Fetch like with populated product details
        const like = await Like.findOne({ userId }).populate("items.productId");

        if (!like) {
            return NextResponse.json({ like: [], message: "like is empty" }, { status: 200 });
        }

        return NextResponse.json(like, { status: 200 });

    } catch (error) {
        console.error("Error fetching like:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
