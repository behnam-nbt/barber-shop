import Service from "@/models/Service";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const services = await Service.find();
        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}