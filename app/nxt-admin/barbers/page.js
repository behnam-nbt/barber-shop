'use client'
import api from "@/api/api";
import AddBarberModal from "@/components/module/back/AddBarberModal";
import EditBarberModal from "@/components/module/back/EditBarberModal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { digitsEnToFa } from "@persian-tools/persian-tools";

function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [barberToEdit, setBarberToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBarberId, setSelectedBarberId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  }
  const fetchData = async () => {
    try {
      const response = await api.get("/api/barbers");
      setBarbers(response.data);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات!");
      throw new Error("خطا در دریافت لیست آرایشگرها!");
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const addBarber = (newBarber) => {
    setBarbers(prevBarbers => [...prevBarbers, newBarber]);
  }

  const handleEdit = (id) => {
    const barber = barbers.find((b) => b._id === id);
    if (barber) {
      setBarberToEdit(barber);
      setIsEditModalOpen(true);
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/barbers/delete/${selectedBarberId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error from server:", errorData.message);
        throw new Error("Failed to delete the barber");
      }

      setBarbers(prevBarbers => prevBarbers.filter(barber => barber._id !== selectedBarberId));

      toast.success('آرایشگر با موفقیت حذف شد!')
      closeConfirmModal();
    } catch (error) {
      toast.error('خطا در حذف پست!', error.message);
    }
  };

  const openConfirmModal = (barberId) => {
    setSelectedBarberId(barberId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedBarberId(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="px-6 py-4">
      <button
        onClick={openModal}
        className="bg-orange-500 py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mb-4"
      >
        ایجاد آرایشگر جدید
      </button>
      {isModalOpen && <AddBarberModal setIsModalOpen={setIsModalOpen} addBarber={addBarber} />}
      <div>
        <h2 className="text-2xl font-bold mb-4">لیست آرایشگرها</h2>
        <div className="overflow-auto rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="border">
              <tr>
                <th className="px-4 py-2 font-bold text-right">شناسه</th>
                <th className="px-4 py-2 font-bold text-right">نام</th>
                <th className="px-4 py-2 font-bold text-right">نام خانوادگی</th>
                <th className="px-4 py-2 font-bold text-right">تصویر</th>
                <th className="px-4 py-2 font-bold text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((barber, index) => (
                <tr key={barber._id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(index + 1)}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{barber.name}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{barber.lastName}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <img
                      src={`${barber.image}?t=${new Date().getTime()}`}
                      alt={barber.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-300">
                    <button className="text-green-500 hover:text-green-700 font-bold ml-2"
                      onClick={() => handleEdit(barber._id)}>
                      ویرایش
                    </button>
                    <EditBarberModal
                      isOpen={isEditModalOpen}
                      barberToEdit={barberToEdit}
                      setIsEditModalOpen={setIsEditModalOpen}
                      updateBarber={(updatedBarber) => {
                        setBarbers((prevBarbers) =>
                          prevBarbers.map((barber) =>
                            barber._id === updatedBarber._id ? updatedBarber : barber
                          )
                        );
                      }}
                    />
                    <button className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => openConfirmModal(barber._id)}>
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

export default Barbers