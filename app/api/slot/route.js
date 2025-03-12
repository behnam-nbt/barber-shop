import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import TimeSlot from "@/models/TimeSlot";

export async function POST(req) {
    await connectDB();
    try {
            const data = await req.formData();
            const barber = data.get("barber");
            const timeSlot = data.get("timeSlot");
            const date = new Date(data.get("date"));
            const isAvailable =  true;
    
            // Check if all required fields are provided
            if (!barber || !timeSlot || !date) {
                return NextResponse.json(
                    { error: "تمام فیلد ها را پر کنید" },
                    { status: 400 }
                );
            }
    
    
            // Ensure the image is a file
            const slot = new TimeSlot({
                barber,
                timeSlot,
                date,
                isAvailable,
            });
    
            await slot.save();
    
            return NextResponse.json({ status: "Success", message: "سرویس با موفقیت اضافه شد!", slot }, { status: 200 });
    
        } catch (error) {
            console.error("خطا در ایجاد تایم:", error.message);
            return NextResponse.json(
                { error: "خطای سرور" },
                { status: 500 }
            );
        }
}

export async function GET() {
    try {
        await connectDB();
        const slots = await TimeSlot.find();
        return NextResponse.json({ status: "Success", slots }, { status: 200 });
    } catch (error) {
        console.error("Error fetching slots:", error);
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }
}