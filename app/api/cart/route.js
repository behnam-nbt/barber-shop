import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        console.log("Received request body:", body);

        const { userId, productId, quantity } = body;

        if (!userId || !productId || !quantity) {
            console.error("Missing required fields:", { userId, productId, quantity });
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        if (!user.cart) user.cart = [];

        const cartItem = user.cart.find((item) => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        return NextResponse.json({ message: "Product added to cart" }, { status: 200 });
    } catch (error) {
        console.error("❌ Server Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
