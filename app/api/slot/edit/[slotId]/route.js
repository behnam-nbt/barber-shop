import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import TimeSlot from "@/models/TimeSlot";

// Handle Edit (PUT) Request
export async function PUT(req) {
    const { slotId } = req.query;
    const { date, timeSlot } = await req.json();

    if (!date || !timeSlot) {
        return NextResponse.json({ error: "لطفا تمام فیلد ها را پر کنید!" }, { status: 400 });
    }

    try {
        // Connect to the database
        await connectDB();

        // Find the existing time slot by ID and update it
        const updatedSlot = await TimeSlot.findByIdAndUpdate(
            slotId, // Find by slot ID
            { date: new Date(date), timeSlot: timeSlot }, // New values to update
            { new: true } // Return the updated document
        );

        if (!updatedSlot) {
            return NextResponse.json({ error: "زمان پیدا نشد!" }, { status: 404 });
        }

        // Return success response with the updated time slot
        return NextResponse.json({ message: "زمان با موفقیت ویرایش شد!", updatedSlot }, { status: 200 });

    } catch (error) {
        console.error("خطا در ویرایش زمان:", error.message);
        return NextResponse.json({ error: "خطای سرور در ویرایش زمان" }, { status: 500 });
    }
}

// The GET method to fetch time slots, as in your provided code
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
