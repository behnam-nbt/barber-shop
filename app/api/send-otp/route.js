import connectDB from "@/utils/connectDB";
import Otp from "@/models/Otp";

export async function POST(req) {
    try {
        await connectDB(); // Ensure DB connection

        const { phoneNumber } = await req.json();
        if (!phoneNumber) {
            return new Response(JSON.stringify({ error: "Phone number is required" }), { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Store OTP in MongoDB (Update if phone exists)
        await Otp.findOneAndUpdate(
            { phoneNumber },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        // Instead of sending SMS, just return the OTP to the console
        console.log("Generated OTP:", otp);

        return new Response(JSON.stringify({ success: true, message: "OTP generated", otp }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error", details: error.message }), { status: 500 });
    }
}
