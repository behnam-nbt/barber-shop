import Barber from "@/models/Barbers";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { barberId } = params;
        const data = await req.formData();
        const name = data.get("name");
        const lastName = data.get("lastName");
        const role = data.get("role");
        const image = data.get("image");

        if (!barberId) {
            return NextResponse.json(
                { error: "آیدی آرایشگر الزامی است." },
                { status: 400 }
            );
        }

        const existingBarber = await Barber.findById(barberId);
        if (!existingBarber) {
            return NextResponse.json(
                { error: "آرایشگر با این آیدی پیدا نشد." },
                { status: 404 }
            );
        }

        // Process new image if provided
        let imagePath = existingBarber.image;
        if (image && image.size > 0) {
            const imageName = `${Date.now()}-${image.name}`;
            const newImagePath = path.join(process.cwd(), "public", "images", imageName);

            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            fs.writeFileSync(newImagePath, bufferData);

            // Delete old image (optional)
            if (existingBarber.image && existingBarber.image.startsWith("/images/")) {
                const oldImagePath = path.join(process.cwd(), "public", existingBarber.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            imagePath = `/images/${imageName}`;
        }

        // Update barber
        existingBarber.name = name || existingBarber.name;
        existingBarber.lastName = lastName || existingBarber.lastName;
        existingBarber.role = role || existingBarber.role;
        existingBarber.image = imagePath;

        await existingBarber.save();

        return NextResponse.json(
            { message: "پست با موفقیت بروزرسانی شد", barber: existingBarber },
            { status: 200 }
        );
    } catch (error) {
        console.error("خطا در بروزرسانی آرایشگر:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}
