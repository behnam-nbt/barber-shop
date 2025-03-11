"use client";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

function EditBarberModal({ isOpen, setIsEditModalOpen, barberToEdit, updateBarber }) {
    const [barber, setBarber] = useState({
        name: "",
        lastName: "",
        role: "",
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (isOpen && barberToEdit) {
            setBarber({
                name: barberToEdit.name || "",
                lastName: barberToEdit.lastName || "",
                role: barberToEdit.role || "",
            });
        }
    }, [isOpen, barberToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBarber((prevBarber) => ({ ...prevBarber, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpdateBarber = async () => {
        try {
            const formData = new FormData();
            formData.append("name", barber.name);
            formData.append("lastName", barber.lastName);
            formData.append("role", barber.role);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch(`/api/barbers/edit/${barberToEdit._id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "خطا در ویرایش آرایشگر");
            }

            const data = await res.json();
            updateBarber(data.barber);

            toast.success("آرایشگر با موفقیت ویرایش شد!");
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error.message || "خطا در ویرایش آرایشگر");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]" style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="absolute top-3 right-3"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-4">ویرایش آرایشگر</h2>

                <input
                    style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                    type="text"
                    name="name"
                    placeholder="نام آرایشگر"
                    value={barber.name}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                    style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                    type="text"
                    name="lastName"
                    placeholder="نام خانوادگی آرایشگر"
                    value={barber.lastName}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                    style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                    type="text"
                    name="role"
                    placeholder="نقش آرایشگر"
                    value={barber.role}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <div className="mt-4">
                    <label className="bloc mb-2">تصویر:</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:bg-orange-500 file:text-white file:py-2 file:px-4 file:rounded-lg"
                    />
                </div>

                <button
                    onClick={handleUpdateBarber}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mt-4"
                >
                    اعمال تغییرات
                </button>
            </div>
        </div>
    );
}

export default EditBarberModal;
