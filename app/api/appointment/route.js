import connectDB from "@/utils/connectDB";
import Appointment from "@/models/Appointment";
import Service from "@/models/Service";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import TimeSlot from "@/models/TimeSlot";

export async function POST(req) {
    await connectDB();
    try {
        const { user, barber, category, serviceId, date, timeSlot } = await req.json();
        console.log("Recived Data:", user, barber, category, serviceId, date, timeSlot)
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return NextResponse.json({ status: "Failed", message: "شناسه سرویس نامعتبر است!" }, { status: 400 });
        }

        const service = await Service.findById(new mongoose.Types.ObjectId(serviceId));
        console.log("Service found:", service);

        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return NextResponse.json({ status: "Failed", message: "دسته بندی نامعتبر است!" }, { status: 400 });
        }

        if (!service || !service.category.equals(categoryDoc._id)) {
            return NextResponse.json({ status: "Failed", message: "سرویس مناسب مرتبط با دسته بندی انتخاب نشده است!" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(barber)) {
            return NextResponse.json({ status: "Failed", message: "شناسه آرایشگر نامعتبر است!" }, { status: 400 });
        }

        const appointmentDate = new Date(date);
        const timeSlotDoc = await TimeSlot.findOne({
            barber: barber,
            date: appointmentDate, // Use the exact date format
            timeSlot: timeSlot, // Find by the timeSlot string
          });
      
          if (!timeSlotDoc || !timeSlotDoc.isAvailable) {
            return NextResponse.json({ status: "Failed", message: "زمان انتخابی برای این آرایشگر در دسترس نیست!" }, { status: 400 });
          }
        const appointment = new Appointment({
            user,
            barber,
            category: categoryDoc._id,
            service: serviceId,
            date: appointmentDate,
            timeSlot: timeSlotDoc._id,
        });

        await appointment.save();
        return NextResponse.json({ status: "Success", message: "نوبت شما با موفقیت رزرو شد!", appointment }, { status: 200 });

    } catch (error) {
        console.error("Error saving appointment:", error);
        return NextResponse.json({ status: "Failed", message: "خطا در رزرو نوبت!" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const slots = await Appointment.find();
        return NextResponse.json({ status: "Success", slots }, { status: 200 });
    } catch (error) {
        console.error("Error fetching slots:", error);
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }
}