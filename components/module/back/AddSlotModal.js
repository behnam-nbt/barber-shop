"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

function AddSlotModal({ setIsModalOpen, addSlot }) {
  const [barbers, setBarbers] = useState([]);
  const [slot, setSlot] = useState({
    barber: "",
    timeSlot: "",
    date: "",
  });

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await fetch("/api/barbers");
        const data = await res.json();

        if (res.ok && data.barbers) {
          setBarbers(data.barbers);
        } else {
          toast.error("خطا در بارگذاری لیست آرایشگرها");
        }
      } catch (error) {
        console.error("Error fetching barbers:", error);
        toast.error("خطا در بارگذاری لیست آرایشگرها");
      }
    };

    fetchBarbers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSlot((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = async () => {
    if (!slot.barber || !slot.date || !slot.timeSlot) {
      toast.error("لطفا تمام فیلدها را پر کنید.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("barber", slot.barber);
      formData.append("date", slot.date);
      formData.append("timeSlot", slot.timeSlot);

      const res = await fetch("/api/slot", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در افزودن تایم");
      }

      toast.success("تایم با موفقیت اضافه شد!");
      addSlot(data.slot);

      setSlot({ barber: "", timeSlot: "", date: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("خطا در ایجاد تایم:", error.message);
      toast.error("خطا در ایجاد تایم");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-md relative w-4/5 max-w-2xl max-h-[90vh] overflow-y-auto p-6" style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
        <IoClose
          className="absolute top-2 left-2 text-lg cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        />
        <h2 className="text-2xl font-bold mb-4">ایجاد تایم جدید</h2>
        <div className="space-y-4">
          <label className="block font-semibold mb-2">انتخاب آرایشگر:</label>
          <select
            name="barber"
            className="w-full p-2 border rounded mb-4"
            value={slot.barber}
            onChange={handleChange}
          >
            <option value="">انتخاب آرایشگر</option>
            {barbers.length > 0 ? (
              barbers.map((barber) => (
                <option key={barber._id} value={barber._id}>
                  {barber.name} {barber.lastName}
                </option>
              ))
            ) : (
              <option disabled>در حال بارگذاری...</option>
            )}
          </select>

          <label className="block font-semibold mb-2">انتخاب تاریخ:</label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border rounded mb-4"
            value={slot.date}
            onChange={handleChange}
          />

          <label className="block font-semibold mb-2">انتخاب ساعت:</label>
          <input
            type="text"
            name="timeSlot"
            className="w-full p-2 border rounded mb-4"
            value={slot.timeSlot}
            onChange={handleChange}
            placeholder="مثال: 10:00 - 10:30"
          />

          <button
            onClick={handleAddSlot}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            افزودن تایم
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSlotModal;
