import Profile from "@/models/Profile";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
        }

        const profile = await Profile.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
}
