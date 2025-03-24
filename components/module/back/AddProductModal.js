"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

import { toast } from "react-toastify";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder';
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import { useUser } from "@/context/AuthContext";

function AddProductModal({ setIsModalOpen, addProduct }) {
    const { user } = useUser();
    const [product, setProduct] = useState({
        title: "",
        slug: "",
        price: "",
        quantity: "",
        tags: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Heading,
            Placeholder.configure({
                placeholder: "توضیحات خود را اینجا وارد کنید...",
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            setProduct((prev) => ({
                ...prev,
                description: editor.getHTML(),
            }));
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => {
            const updatedProduct = { ...prev, [name]: value };
            if (name === "title") {
                updatedProduct.slug = value.trim().toLowerCase().replace(/\s+/g, "-");
            }
            return updatedProduct;
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("title", product.title);
            formData.append("slug", product.slug);
            formData.append("price", product.price);
            formData.append("quantity", product.quantity);
            formData.append("description", product.description);
            formData.append("tags", product.tags);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("API Response:", data);
            if (!res.ok) {
                throw new Error(data.error || "خطا در افزودن محصول");
            }

            toast.success("محصول با موفقیت اضافه شد:", data);
            setProduct({
                title: "",
                slug: "",
                price: "",
                quantity: "",
                tags: "",
                description: "",
            });
            addProduct(data.product);
            setImageFile(null);
            setIsModalOpen(false);
            editor?.commands.clearContent();
        } catch (error) {
            console.error("خطا در ایجاد محصول:", error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-md relative w-4/5 max-w-2xl max-h-[90vh] overflow-y-auto p-6" style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <IoClose
                    className="absolute top-2 left-2 text-lg cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                />
                <h2 className="text-2xl font-bold mb-4">ایجاد محصول جدید</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="عنوان محصول"
                        value={product.title}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="slug"
                        placeholder="آدرس"
                        value={product.slug}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="price"
                        placeholder="قیمت"
                        value={product.price}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        name="quantity"
                        placeholder="تعداد محصول"
                        value={product.quantity}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    {/* Tags Input */}
                    <input
                        type="text"
                        name="tags"
                        placeholder="برچسب ها (با ویرگول جدا کنید)"
                        value={product.tags}
                        onChange={handleChange}
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Tiptap Editor */}
                    <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex space-x-2 mb-2">
                            <button
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("bold")
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                Bold
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("italic")
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                Italic
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 1 })
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                H1
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 2 })
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                H2
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 3 })
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                H3
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 4 })
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                H4
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 5 })
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                H5
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                                className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 6 })
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                H6
                            </button>
                        </div>
                        <div className="min-h-[200px]">
                            <EditorContent
                                editor={editor}
                                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block mb-2">تصویر:</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-orange-500 file:text-white file:py-2 file:px-4 file:rounded-lg"
                        />
                    </div>
                    <button
                        onClick={handleAddProduct}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition"
                    >
                        افزودن محصول
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddProductModal;
