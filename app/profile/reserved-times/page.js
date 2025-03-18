'use client'

import api from "@/api/api";
import { useUser } from "@/context/AuthContext";
import { useEffect, useState } from "react";

function ReservedTimes() {
    const [times, setTimes] = useState([]);
    const [services, setServices] = useState([]);
    const { user, loading } = useUser();

    const fetchTimes = async () => {
        try {
            const res = await api.get("/api/appointment");
            if (res.data.status === "Success") {
                const appointments = res.data.slots.filter((slot) => slot.user === user.phoneNumber);
                setTimes(appointments);
            }
        } catch (error) {
            console.log("Error fetching times:", error);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await api.get("/api/back/services");
            if (res.status === 200) {
                setServices(res.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (!loading && user) {
            fetchTimes();
        }
    }, [loading, user]);

    return (
        <div className="max-w-3xl p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">وقت های رزرو شده</h2>
            {times.length > 0 ? (
                <div className="space-y-4">
                    {times.map((time) => (
                        <div key={time._id} className="shadow-md rounded-lg p-4 border border-zinc-500">
                            <p className="text-gray-500">
                                <span className="font-semibold">تاریخ: </span> {new Date(time.date).toLocaleDateString("fa-IR")}
                            </p>
                            <p className="text-gray-500">
                                <span className="font-semibold">خدمات: </span> {services.find(service => service._id === time.service)?.name || "Unknown"}
                            </p>
                            <p className={`text-sm font-semibold mt-2 p-2 rounded-md ${time.status === "Confirmed" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                                {time.status === "Pending" ? "در انتظار تایید" : "تایید شده"}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">شما وقت رزرو شده ندارید!</p>
            )}
        </div>
    );
}

export default ReservedTimes;
