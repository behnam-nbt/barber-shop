"use client";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";

function EditProductModal({ isOpen, setIsEditModalOpen, productToEdit, updateProduct }) {
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
    content: productToEdit?.description || "",
    onUpdate: ({ editor }) => {
        setProduct((prev) => ({
        ...prev,
        description: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    if (isOpen && productToEdit) {
        setProduct({
        title: productToEdit.title || "",
        slug: productToEdit.slug || "",
        price: productToEdit.price || "",
        quantity: productToEdit.quantity || "",
        tags: productToEdit.tags || "",
        description: productToEdit.description || "",
      });
      editor?.commands.setContent(productToEdit.description || "");
    }
  }, [isOpen, productToEdit, editor]);

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

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("slug", product.slug);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("tags", product.tags);
      formData.append("description", product.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`/api/products/edit/${productToEdit._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "خطا در ویرایش محصول");
      }

      const data = await res.json();
      updateProduct(data.product);

      toast.success("محصول با موفقیت ویرایش شد!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.message || "خطا در ویرایش محصول");
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
        <h2 className="text-2xl font-bold mb-4">ویرایش محصول</h2>

        <input
          style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
          type="text"
          name="title"
          placeholder="عنوان پست"
          value={product.title}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
          type="text"
          name="slug"
          placeholder="آدرس"
          value={product.slug}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
          type="text"
          name="price"
          placeholder="قیمت"
          value={product.price}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
          type="text"
          name="quantity"
          placeholder="تعداد محصول"
          value={product.quantity}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Tags Input */}
        <input
          style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
          type="text"
          name="tags"
          placeholder="برچسب ها (با ویرگول جدا کنید)"
          value={product.tags}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Content area: Allowing the entire modal to scroll */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`py-1 px-3 rounded-lg ${editor?.isActive("bold")
                ? "bg-orange-500 text-white"
                : "bg-gray-600"
                }`}
            >
              Bold
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`py-1 px-3 rounded-lg ${editor?.isActive("italic")
                ? "bg-orange-500 text-white"
                : "bg-gray-600"
                }`}
            >
              Italic
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 1 })
                ? "bg-orange-500 text-white"
                : "bg-gray-600"
                }`}
            >
              H1
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`py-1 px-3 rounded-lg ${editor?.isActive("heading", { level: 2 })
                ? "bg-orange-500 text-white"
                : "bg-gray-600"
                }`}
            >
              H2
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>

        <div className="mt-4">
          <label className="bloc mb-2">تصویر:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:bg-orange-500 file:text-white file:py-2 file:px-4 file:rounded-lg"
          />
        </div>

        <button
          onClick={handleUpdateProduct}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mt-4"
        >
          اعمال تغییرات
        </button>
      </div>
    </div>
  );
}

export default EditProductModal;
