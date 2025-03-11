"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

import { toast } from "react-toastify";

function AddBarberModal({ setIsModalOpen, addBarber }) {
    const [barber, setBarber] = useState({
        name: "",
        lastName: "",
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBarber((prevBarber) => ({ ...prevBarber, [name]: value }))
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddBarber = async () => {
        try {
            const formData = new FormData();
            formData.append("name", barber.name);
            formData.append("lastName", barber.lastName);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch("/api/barbers", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "خطا در افزودن آرایشگر");
            }

            toast.success("آرایشگر با موفقیت اضافه شد:", data);
            setBarber({
                name: "",
                lastName: "",
            });
            addBarber(data.barber);
            setImageFile(null);
            setIsModalOpen(false);
            editor?.commands.clearContent();
        } catch (error) {
            console.error("خطا در ایجاد آزایشگر:", error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-md relative w-4/5 max-w-2xl max-h-[90vh] overflow-y-auto p-6" style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <IoClose
                    className="absolute top-2 left-2 text-lg cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                />
                <h2 className="text-2xl font-bold mb-4">ایجاد آرایشگر جدید</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="نام آرایشگر"
                        value={barber.name}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="نام خانوادگی آرایشگر"
                        value={barber.lastName}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="role"
                        placeholder="نقش آرایشگر"
                        value={barber.role}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div>
                        <label className="block mb-2">تصویر:</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:bg-orange-500 file:text-white file:py-2 file:px-4 file:rounded-lg"
                        />
                    </div>
                    <button
                        onClick={handleAddBarber}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition"
                    >
                        افزودن آرایشگر
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddBarberModal;
