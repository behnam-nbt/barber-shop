import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Barber from "@/models/Barbers";

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.formData();
        const name = data.get("name");
        const lastName = data.get("lastName");
        const role = data.get("role");
        const image = data.get("image");

        // Check if all required fields are provided
        if (!name || !lastName || !image || !role) {
            return NextResponse.json(
                { error: "تمام فیلد ها را پر کنید" },
                { status: 400 }
            );
        }


        // Ensure the image is a file
        if (image && image.size > 0) {
            // Generate a unique filename to avoid conflicts
            const imageName = `${image.name}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

            // Write the file to the public/images/ directory
            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            fs.writeFileSync(imagePath, bufferData);

            // Save the relative path to MongoDB (e.g., /images/imageName)
            const barber = new Barber({
                name,
                lastName,
                role,
                image: `/images/${imageName}` // Save the relative path
            });

            await barber.save();

            return NextResponse.json(
                { message: "آرایشگر با موفقیت اضافه شد:", barber },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "فایل تصویر معتبر نیست." },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("خطا در ایجاد آرایشگر:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const barbers = await Barber.find();
        return NextResponse.json({ barbers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching barbers:", error);
        return NextResponse.json({ error: "Failed to fetch barbers" }, { status: 500 });
    }
}