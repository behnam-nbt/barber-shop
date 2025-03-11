import connectDB from "@/utils/connectDB";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Category from "@/models/Category";

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.formData();
        const category = data.get("category");
        const name = data.get("name");
        const duration = data.get("duration");
        const price = data.get("price");

        // Check if all required fields are provided
        if (!category || !name || !duration || !price) {
            return NextResponse.json(
                { error: "تمام فیلد ها را پر کنید" },
                { status: 400 }
            );
        }


        // Ensure the image is a file
        const service = new Service({
            category,
            name,
            duration,
            price,
        });

        await service.save();

        return NextResponse.json({ status: "Success", message: "سرویس با موفقیت اضافه شد!", service }, { status: 200 });

    } catch (error) {
        console.error("خطا در ایجاد سوریس:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await connectDB();
    try {
        const categoryName = req.nextUrl.searchParams.get("category");
        if (!categoryName) {
            return NextResponse.json({ status: "Failed", message: "دسته بندی مشخص نشده است!" }, { status: 400 });
        }

        // Find the category by name
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return NextResponse.json({ status: "Failed", message: "دسته بندی پیدا نشد!" }, { status: 404 });
        }

        // Now we have the category ObjectId, use it to fetch services
        const services = await Service.find({ category: category._id });

        return NextResponse.json({ status: "Success", services }, { status: 200 });
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ status: "Failed", message: "خطا در دریافت خدمات!" }, { status: 500 });
    }
}


