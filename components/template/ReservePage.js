"use client";

import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const DatePicker = dynamic(() => import("zaman").then((mod) => mod.DatePicker), { ssr: false });

function ReservePage({ barbers, categories }) {
    const [category, setCategory] = useState("");
    const [service, setService] = useState("");
    const [barber, setBarber] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [availableServices, setAvailableServices] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [reservedTimeSlots, setreservedTimeSlots] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(true);

    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            const currentPath = window.location.pathname;
            if (!localStorage.getItem("redirectAfterLogin")) {
                localStorage.setItem("redirectAfterLogin", currentPath);
            }
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    const timeSlots = ["10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00"];

    useEffect(() => {
        const fetchServices = async () => {
            if (!category) return;

            try {
                const res = await fetch(`/api/services?category=${category}`);
                const data = await res.json();
                setAvailableServices(data.services);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, [category]);

    useEffect(() => {
        const fetchTimeSlots = async () => {
            if (!barber || !date) return;
    
            try {
                const res = await fetch(`/api/slot`);
                const data = await res.json();
                const filteredSlots = data.slots.filter((slot) => {
                    const isAvailable =
                        slot.barber.toString() === barber &&
                        new Date(slot.date).toLocaleDateString() === new Date(date).toLocaleDateString();
    
                    if (!isAvailable) return false;
    
                    const slotDate = new Date(slot.date); 
                    const localSlotDate = new Date(slotDate.toLocaleString());
    
                    const [startTime, endTime] = slot.timeSlot.split(" - ");
                    const [startHour, startMinute] = startTime.split(":").map(Number);
                    const startSlotTime = new Date(localSlotDate.setHours(startHour, startMinute, 0, 0));
    
                    const currentTime = new Date(); 
    
                    if (startSlotTime > currentTime) {
                        return true;
                    }
    
                    return false;
                });
    
                // Remove reserved time slots from available slots
                const availableSlots = filteredSlots.filter(
                    (slot) =>
                        !reservedTimeSlots.some((reserved) => reserved.timeSlot === slot._id)
                );
    
                setAvailableTimeSlots(availableSlots);
            } catch (error) {
                console.error("Error fetching time slots:", error);
            }
        };
    
        fetchTimeSlots();
    }, [barber, date, reservedTimeSlots]);
    

    useEffect(() => {
        const fetchReservedTimeSlots = async () => {
            try {
                const res = await fetch(`/api/appointment`);
                const data = await res.json();

                if (data.status === "Success" && Array.isArray(data.slots)) {
                    setreservedTimeSlots(data.slots);
                } else {
                    toast.error("Unexpected response format:", data);
                }
            } catch (error) {
                toast.error("Error fetching reserved time slots:", error);
            }
        };

        fetchReservedTimeSlots();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category || !service || !barber || !date || !timeSlot) {
            alert("لطفا همه فیلدها را پر کنید.");
            return;
        }
        if (!user || !user.phoneNumber) {
            alert("خطا: کاربر وارد نشده است!");
            return;
        }

        const appointmentData = {
            user: user.phoneNumber,
            barber,
            category,
            serviceId: service,
            date,
            timeSlot,
        };
        console.log(appointmentData);
        try {
            const res = await fetch("/api/appointment", {
                method: "POST",
                body: JSON.stringify(appointmentData),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "خطا در افزودن آرایشگر");
            }
            toast.success("نوبت شما با موفقیت رزرو شد!");
            setCategory("");
            setService("");
            setBarber("");
            setDate("");
            setTimeSlot("");
        } catch (error) {
            console.error("خطا در ایجاد آزایشگر:", error.message);
        }
    };

    return (
        <div className="min-h-screen px-4 py-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-orange-600">رزرو صندلی</h1>
            <div className="mt-10 text-center w-full max-w-lg">
                <h2 className="font-bold text-2xl mb-4">نوبت بعدی خودت را همین الان رزرو کن</h2>
                <p className="text-gray-600">
                    اگر شما بعد از یک روز پر مشغله احساس بدی دارید، باید بگم که ما خوشحالیم که میتوانیم به شما یک راه حل لذتبخش برای پیدا کردن یک حس فوق العاده هدیه بدیم.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 w-full max-w-lg shadow-md p-6 rounded-lg" style={{ backgroundColor: "var(--background-color)" }}>
                {/* Category Selection */}
                <label className="block font-semibold mb-2">دسته بندی خدمات:</label>
                <select
                    style={{ backgroundColor: "var(--background-color)" }}
                    className="w-full p-2 border rounded mb-4"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">انتخاب کنید</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Service Selection */}
                <label className="block font-semibold mb-2">انتخاب سرویس:</label>
                <select
                    style={{ backgroundColor: "var(--background-color)" }}
                    className="w-full p-2 border rounded mb-4"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    disabled={!category}
                >
                    <option value="">انتخاب کنید</option>
                    {availableServices.map((srv) => (
                        <option key={srv._id} value={srv._id}>
                            {srv.name}
                        </option>
                    ))}
                </select>

                {/* Barber Selection */}
                <label className="block font-semibold mb-2">انتخاب آرایشگر:</label>
                <select
                    style={{ backgroundColor: "var(--background-color)" }}
                    className="w-full p-2 border rounded mb-4"
                    value={barber}
                    onChange={(e) => setBarber(e.target.value)}
                >
                    <option value="">انتخاب کنید</option>
                    {barbers.map((b) => (
                        <option key={b._id} value={b._id}>
                            {b.name} {b.lastName}
                        </option>
                    ))}
                </select>

                {/* Date Picker */}
                <label className="block font-semibold mb-2">تاریخ رزرو:</label>
                {DatePicker && (
                    <DatePicker
                        inputAttributes={{
                            placeholder: "تاریخ",
                            style: { borderLeft: "none", backgroundColor: "var(--background-color)" },
                        }}
                        accentColor="#EE5A24"
                        onChange={(value) => {
                            if (value && value.value) {
                                const formattedDate = new Date(value.value).toISOString().split('T')[0];
                                setDate(formattedDate); 
                            }
                        }}
                        value={date ? { value: date } : null} 
                        inputClass="w-full p-2 border rounded mb-4"
                    />
                )}

                <label className="block font-semibold mb-2">انتخاب ساعت:</label>
                <select
                    style={{ backgroundColor: "var(--background-color)" }}
                    className="w-full p-2 border rounded mb-4"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                >
                    <option value="">انتخاب کنید</option>
                    {availableTimeSlots.map((slot, index) => (
                        <option key={index} value={slot.timeSlot}>
                            {slot.timeSlot}
                        </option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded mt-4 hover:bg-orange-700">
                    رزرو نوبت
                </button>
            </form>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default ReservePage;
