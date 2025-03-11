import Barber from "@/models/Barbers";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    await connectDB();

    try {
        const { barberId } = await params;

        if (!barberId) {
            return NextResponse.json(
                { status: "failed", message: "Barber ID is required!" },
                { status: 400 }
            );
        }

        const deletedBarber = await Barber.findByIdAndDelete(barberId);

        if (!deletedBarber) {
            return NextResponse.json(
                { status: "failed", message: "Barber not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { status: "success", message: "Barber deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete process:", error);
        return NextResponse.json(
            { status: "failed", message: "Error in deleting Barber!" },
            { status: 500 }
        );
    }
}
