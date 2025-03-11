'use client'
import api from "@/api/api";
import AddSlotModal from "@/components/module/back/AddSlotModal";
import EditSlotModal from "@/components/module/back/EditSlotModal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { digitsEnToFa } from "@persian-tools/persian-tools";

function TimeSlots() {
    const [slots, setSlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [slotToEdit, setSlotToEdit] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const fetchData = async () => {
        try {
            const response = await fetch("/api/slot");

            if (!response.ok) {
                throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
            }

            const data = await response.json();
            setSlots(data.slots);
        } catch (error) {
            console.error("خطا در دریافت لیست تایم ها:", error);
            toast.error("خطا در دریافت اطلاعات!");
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const addSlot = (newSlot) => {
        setSlots(prevSlots => [...prevSlots, newSlot]);
    }

    const handleEdit = (id) => {
        const slot = slots.find((b) => b._id === id);
        if (slot) {
            setSlotToEdit(slot);
            setIsEditModalOpen(true);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/slot/delete/${selectedSlotId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error from server:", errorData.message);
                throw new Error("Failed to delete the slots");
            }

            setSlots(prevSlots => prevSlots.filter(slot => slot._id !== selectedSlotId));

            toast.success('تایم با موفقیت حذف شد!')
            closeConfirmModal();
        } catch (error) {
            toast.error('خطا در حذف تایم!', error.message);
        }
    };

    const openConfirmModal = (slotId) => {
        setSelectedSlotId(slotId);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setSelectedSlotId(null);
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="px-6 py-4">
            <button
                onClick={openModal}
                className="bg-orange-500 py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mb-4"
            >
                ایجاد تایم جدید
            </button>
            {isModalOpen && <AddSlotModal setIsModalOpen={setIsModalOpen} addSlot={addSlot} />}
            <div>
                <h2 className="text-2xl font-bold mb-4">لیست تایم ها</h2>
                <div className="overflow-auto rounded-lg shadow-lg">
                    <table className="min-w-full border border-gray-200">
                        <thead className="border">
                            <tr>
                                <th className="px-4 py-2 font-bold text-right">شناسه</th>
                                <th className="px-4 py-2 font-bold text-right">نام آرایشگر</th>
                                <th className="px-4 py-2 font-bold text-right">تایم های رزرو</th>
                                <th className="px-4 py-2 font-bold text-right">تاریخ</th>
                                <th className="px-4 py-2 font-bold text-right">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.map((slot, index) => (
                                <tr key={slot._id} className="hover:bg-gray-800">
                                    <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(index + 1)}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">{slot.barberId}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">{slot.timeSlot}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">{new Date(slot.date).toLocaleDateString("fa-IR")}</td>
                                    <td className="px-4 py-2 text-right border border-gray-300">
                                        <button className="text-green-500 hover:text-green-700 font-bold ml-2"
                                            onClick={() => handleEdit(slot._id)}>
                                            ویرایش
                                        </button>
                                        <EditSlotModal
                                            isOpen={isEditModalOpen}
                                            slotToEdit={slotToEdit}
                                            setIsEditModalOpen={setIsEditModalOpen}
                                            updateSlot={(updatedSlot) => {
                                                setSlots((prevSlots) =>
                                                    prevSlots.map((slot) =>
                                                        slot._id === updatedSlot._id ? updatedSlot : slot
                                                    )
                                                );
                                            }}
                                        />
                                        <button className="text-red-500 hover:text-red-700 font-bold"
                                            onClick={() => openConfirmModal(slot._id)}>
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

export default TimeSlots