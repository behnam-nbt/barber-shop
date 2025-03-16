'use client'
import api from "@/api/api";
import AddCategoryModal from "@/components/module/back/AddCategoryModal";
import EditCategoryModal from "@/components/module/back/EditCategoryModal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { digitsEnToFa } from "@persian-tools/persian-tools";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const fetchData = async () => {
        try {
            const response = await api.get("/api/categories");
            setCategories(response.data.categories);
        } catch (error) {
            toast.error("خطا در دریافت اطلاعات!");
            throw new Error("خطا در دریافت لیست دسته بندی ها!");
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const addCategory = (newCategory) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);
    }

    const handleEdit = (id) => {
        const category = categories.find((cat) => cat._id === id);
        if (category) {
            setCategoryToEdit(category);
            setIsEditModalOpen(true);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/categories/delete/${selectedCategoryId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error from server:", errorData.message);
                throw new Error("Failed to delete the category");
            }

            setCategories(prevCategories => prevCategories.filter(category => category._id !== selectedCategoryId));

            toast.success('دسته بندی با موفقیت حذف شد!')
            closeConfirmModal();
        } catch (error) {
            toast.error('خطا در حذف دسته بندی!', error.message);
        }
    };

    const openConfirmModal = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setSelectedCategoryId(null);
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="px-6 py-4">
            <button
                onClick={openModal}
                className="bg-orange-500 py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mb-4"
            >
                ایجاد دسته بندی جدید
            </button>
            {isModalOpen && <AddCategoryModal setIsModalOpen={setIsModalOpen} addCategory={addCategory} />}
            <div>
                <h2 className="text-2xl font-bold mb-4">لیست دسته بندی ها</h2>
                <div className="overflow-auto rounded-lg shadow-lg">
                    <table className="min-w-full border border-gray-200">
                        <thead className="border">
                            <tr>
                                <th className="px-4 py-2 font-bold text-right">ردیف</th>
                                <th className="px-4 py-2 font-bold text-right">شناسه</th>
                                <th className="px-4 py-2 font-bold text-right">نام</th>
                                <th className="px-4 py-2 font-bold text-right">تاریخ ایجاد</th>
                                <th className="px-4 py-2 font-bold text-right">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category._id} className="hover:bg-gray-800">
                                    <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(index + 1)}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">{category.id}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">{category.name}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">{new Date(category.createdAt).toLocaleDateString("fa-IR")}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">
                                        <button className="text-green-500 hover:text-green-700 font-bold ml-2"
                                            onClick={() => handleEdit(cate._id)}>
                                            ویرایش
                                        </button>
                                        <EditCategoryModal
                                            isOpen={isEditModalOpen}
                                            categoryToEdit={categoryToEdit}
                                            setIsEditModalOpen={setIsEditModalOpen}
                                            updateCategory={(updatedCategory) => {
                                                setCategories((prevCategories) =>
                                                    prevCategories.map((category) =>
                                                        category._id === updatedCategory._id ? updatedCategory : category
                                                    )
                                                );
                                            }}
                                        />
                                        <button className="text-red-500 hover:text-red-700 font-bold"
                                            onClick={() => openConfirmModal(category._id)}>
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-bold mb-4">آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 py-2 px-4 rounded-lg font-bold hover:bg-red-600 transition"
                            >
                                بله، حذف کن
                            </button>
                            <button
                                onClick={closeConfirmModal}
                                className="bg-gray-500 py-2 px-4 rounded-lg font-bold hover:bg-gray-600 transition"
                            >
                                لغو
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default Categories