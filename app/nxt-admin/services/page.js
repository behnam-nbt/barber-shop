'use client'
import api from "@/api/api";
import AddServiceModal from "@/components/module/back/AddServiceModal";
import EditServiceModal from "@/components/module/back/EditServiceModal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { digitsEnToFa } from "@persian-tools/persian-tools";

function Services() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [serviceToedit, setServiceToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  }
  const fetchData = async () => {
    try {
      const response = await api.get("/api/back/services");
      setServices(response.data);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات!");
      throw new Error("خطا در دریافت لیست خدمات!");
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const addService = (newService) => {
    setServices(prevServices => [...prevServices, newService]);
  }

  const handleEdit = (id) => {
    const service = services.find((srv) => srv._id === id);
    if (service) {
      setServiceToEdit(barber);
      setIsEditModalOpen(true);
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/services/delete/${selectedServiceId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error from server:", errorData.message);
        throw new Error("Failed to delete the service");
      }

      setServices(prevServices => prevServices.filter(service => service._id !== selectedServiceId));

      toast.success('سرویس با موفقیت حذف شد!')
      closeConfirmModal();
    } catch (error) {
      toast.error('خطا در حذف سرویس!', error.message);
    }
  };

  const openConfirmModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedServiceId(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="px-6 py-4">
      <button
        onClick={openModal}
        className="bg-orange-500 py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mb-4"
      >
        ایجاد سرویس جدید
      </button>
      {isModalOpen && <AddServiceModal setIsModalOpen={setIsModalOpen} addService={addService} />}
      <div>
        <h2 className="text-2xl font-bold mb-4">لیست خدمات</h2>
        <div className="overflow-auto rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="border">
              <tr>
                <th className="px-4 py-2 font-bold text-right">شناسه</th>
                <th className="px-4 py-2 font-bold text-right">نام</th>
                <th className="px-4 py-2 font-bold text-right">دسته بندی</th>
                <th className="px-4 py-2 font-bold text-right">مدت زمان</th>
                <th className="px-4 py-2 font-bold text-right">هزینه</th>
                <th className="px-4 py-2 font-bold text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service._id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(index + 1)}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{service.name}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{service.category}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{service.duration}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{service.price}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">
                    <button className="text-green-500 hover:text-green-700 font-bold ml-2"
                      onClick={() => handleEdit(service._id)}>
                      ویرایش
                    </button>
                    <EditServiceModal
                      isOpen={isEditModalOpen}
                      serviceToedit={serviceToedit}
                      setIsEditModalOpen={setIsEditModalOpen}
                      updateService={(updatedService) => {
                        setServices((prevServices) =>
                            prevServices.map((service) =>
                                service._id === updatedService._id ? updatedService : service
                          )
                        );
                      }}
                    />
                    <button className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => openConfirmModal(service._id)}>
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

export default Services