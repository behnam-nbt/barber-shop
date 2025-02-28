import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

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
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error", details: error.message }), { status: 500 });
    }
}
