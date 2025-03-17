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
        const phoneNumber = data.get("phoneNumber");

        if (!phoneNumber) {
            return NextResponse.json({ status: "Failed", message: "فیلد شماره را پر کنید!" }, { status: 400 });
        }
        const existingProfile = await Profile.findOne({ phoneNumber });

        if (existingProfile) {
            // 🔄 Update the existing profile
            await Profile.findOneAndUpdate(
                { phoneNumber },
                { name, lastName, email },
                { new: true } // Return updated document
            );
        } else {
            // 🆕 Create a new profile if it doesn't exist
            const newProfile = new Profile({
                name,
                lastName,
                email,
                phoneNumber,
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

        // 🔹 Get token from headers
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // 🔹 Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
        }

        console.log("✅ Decoded JWT:", decoded); // Debugging step

        // 🔹 Find user by phoneNumber
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
