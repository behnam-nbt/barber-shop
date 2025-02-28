import connectDB from "@/utils/connectDB";
import Otp from "@/models/Otp";
import User from "@/models/User"; // Import User model
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();

        const { phoneNumber, otp } = await req.json();

        if (!phoneNumber || !otp) {
            return new Response(JSON.stringify({ error: "Phone number and OTP are required" }), { status: 400 });
        }

        // Find OTP in database
        const otpRecord = await Otp.findOne({ phoneNumber });

        if (!otpRecord) {
            return new Response(JSON.stringify({ error: "OTP not found or expired" }), { status: 400 });
        }

        // 🔹 Check if OTP is expired
        if (new Date() > new Date(otpRecord.expiresAt)) {
            await Otp.deleteOne({ phoneNumber }); // Remove expired OTP
            return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
        }

        // 🔹 Check if OTP is incorrect
        if (otpRecord.otp.toString() !== otp.toString()) {
            return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
        }

        // 🔹 ✅ OTP is correct, now delete it!
        await Otp.deleteOne({ phoneNumber });

        // 🔹 Check if user exists
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            // 🔹 Create a new user
            user = new User({
                phoneNumber,
                createdAt: new Date(),
                lastLogin: new Date()
            });
            await user.save();
        } else {
            // 🔹 Update last login timestamp
            user.lastLogin = new Date();
            await user.save();
        }

        // Generate JWT tokens
        const accessToken = jwt.sign({ userId: user._id, phoneNumber }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ userId: user._id, phoneNumber }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

        return new Response(JSON.stringify({ accessToken, refreshToken, user }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error", details: error.message }), { status: 500 });
    }
}
