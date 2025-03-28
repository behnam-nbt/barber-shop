import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import Cart from "@/models/Cart";
import Product from "@/models/Product"; // Importing Product model for population

// Handle POST request (Add to Cart)
export async function POST(req) {
    try {
        await connectDB();
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || !quantity) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product exists in cart
        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        return NextResponse.json({ message: "Product added to cart", cart }, { status: 200 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// Handle GET request (Fetch cart items)
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

        // Fetch cart with populated product details
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return NextResponse.json({ cart: [], message: "Cart is empty" }, { status: 200 });
        }

        return NextResponse.json(cart, { status: 200 });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
