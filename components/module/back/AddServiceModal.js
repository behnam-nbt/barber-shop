"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

import { toast } from "react-toastify";

function AddServiceModal({ setIsModalOpen, addService }) {
    const [service, setService] = useState({
        category: "",
        name: "",
        duration: "",
        price: ""
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (res.ok) {
                    setCategories(data.categories);
                } else {
                    toast.error("خطا در بارگذاری دسته بندی ها");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("خطا در بارگذاری دسته بندی ها");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService((prevService) => ({ ...prevService, [name]: value }))
    };


    const handleAddService = async () => {
        try {
            if (!service.category || !service.name || !service.duration || !service.price) {
                toast.error("لطفا همه فیلدها را پر کنید.");
                return;
            }
            const formData = new FormData();
            formData.append("category", service.category);
            formData.append("name", service.name);
            formData.append("duration", service.duration);
            formData.append("price", service.price);

            const res = await fetch("/api/services", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "خطا در افزودن سرویس");
            }

            toast.success("سرویس با موفقیت اضافه شد:", data);
            setService({
                category: "",
                name: "",
                duration: "",
                price: "",
            });
            addService(data.service);
            setIsModalOpen(false);
        } catch (error) {
            console.error("خطا در ایجاد سرویس:", error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-md relative w-4/5 max-w-2xl max-h-[90vh] overflow-y-auto p-6" style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <IoClose
                    className="absolute top-2 left-2 text-lg cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                />
                <h2 className="text-2xl font-bold mb-4">ایجاد سرویس جدید</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="نام سرویس"
                        value={service.name}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="duration"
                        placeholder="مدت زمان"
                        value={service.duration}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="price"
                        placeholder="قیمت"
                        value={service.price}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <select
                        name="category"
                        value={service.category}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">انتخاب دسته بندی</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddService}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition"
                    >
                        افزودن سرویس
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddServiceModal;
