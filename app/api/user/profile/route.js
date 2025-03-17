import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Profile from "@/models/Profile";

export async function POST(req) {
    await connectDB();

    try {
        const data = await req.formData();
        const name = data.get("name");
        const lastName = data.get("lastName");
        const email = data.get("email");
        const userId = data.get("userId");

        if (!userId) {
            return NextResponse.json({ status: "Failed", message: "شناسه کاربر مورد نیاز است" }, { status: 400 });
        }
        const existingProfile = await Profile.findOne({ userId });

        if (existingProfile) {
            await Profile.findOneAndUpdate(
                { userId },
                { name, lastName, email },
                { new: true }
            );
        } else {
            const newProfile = new Profile({
                name,
                lastName,
                email,
                userId,
            });
            await newProfile.save();
        }
        return NextResponse.json({ status: "Success", message: "اطلاعات با موفقیت ذخیره شد!" }, { status: 200 });

    } catch (error) {
        console.error("خطا در ذخیره اطلاعات!:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await connectDB();

        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
        }

        const user = await User.findOne({ phoneNumber: decoded.phoneNumber });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({
            id: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            createdAt: user.createdAt
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error", details: error.message }), { status: 500 });
    }
}
