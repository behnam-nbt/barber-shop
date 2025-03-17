import Profile from "@/models/Profile";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { phone } = await params;
        console.log("API hit for phone:", phone);

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        const profile = await Profile.findOne({ phone });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
}
