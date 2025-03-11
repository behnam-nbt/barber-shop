import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import Category from "@/models/Category";

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.formData();
        const id = data.get("id");
        const name = data.get("name");

        if (!id || !name) {
            return NextResponse.json(
                { error: "تمام فیلد ها را پر کنید" },
                { status: 400 }
            );
        }

        const category = new Category({
            id,
            name,
        });

        await category.save();

        return NextResponse.json({ status: "Success", message: "دسته بندی با موفقیت اضافه شد!", category }, { status: 200 });


    } catch (error) {
        console.error("خطا در ایجاد دسته بندی:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find();
        return NextResponse.json({ status: "Success", categories }, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}