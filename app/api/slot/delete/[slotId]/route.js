import TimeSlot from "@/models/TimeSlot";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    await connectDB();

    try {
        const { slotId } = await params;

        if (!slotId) {
            return NextResponse.json(
                { status: "failed", message: "Time ID is required!" },
                { status: 400 }
            );
        }

        const deletedSlot = await TimeSlot.findByIdAndDelete(slotId);

        if (!deletedSlot) {
            return NextResponse.json(
                { status: "failed", message: "Slot not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { status: "success", message: "Slot deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete process:", error);
        return NextResponse.json(
            { status: "failed", message: "Error in deleting Slot!" },
            { status: 500 }
        );
    }
}
