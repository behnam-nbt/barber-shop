"use client";
import Image from "next/image";
import { GoShareAndroid } from "react-icons/go";
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

function Barbers({ barbers }) {
    const [isHovered, setIsHovered] = useState(null);
    const socialMediaIcons = [
        { id: "instagram", icon: <a href="#"><FaInstagram /></a>, delay: 0.1 },
        { id: "facebook", icon: <a href="#"><FaFacebook /></a>, delay: 0.2 },
        { id: "telegram", icon: <a href="#"><FaTelegram /></a>, delay: 0.3 },
        { id: "twitter", icon: <a href="#"><FaTwitter /></a>, delay: 0.4 },
        { id: "youtube", icon: <a href="#"><FaYoutube /></a>, delay: 0.5 },
    ];

    return (
        <div className="pt-10">
            <div className="text-center">
                <h1 className="text-3xl mb-4">آرایشگرهای ما</h1>
                <p className="text-zinc-500 w-96 mx-auto">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 px-2 md:w-[70%] mx-auto mt-10">
                {barbers.map((barber) => (
                    <div key={barber._id} className="relative border border-zinc-700">
                        <Image src={barber.image} width={1900} height={1200} className="w-[100%] h-[450px] object-cover" alt={barber.name} />

                        <div
                            className="flex justify-between items-center absolute bottom-0 h-24 p-4 w-full z-10"
                            style={{ backgroundColor: "var(--background-color)" }}
                        >
                            <div>
                                <h1 className="text-2xl">{barber.name}</h1>
                                <p className="text-lg">{barber.role}</p>
                            </div>

                            <div
                                className="relative"
                                onMouseEnter={() => setIsHovered(barber.id)}
                                onMouseLeave={() => setIsHovered(null)}
                            >
                                <GoShareAndroid className="text-2xl cursor-pointer" />

                                <div className="absolute bottom-8 left-0 flex flex-col gap-2">
                                    {socialMediaIcons.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: isHovered === barber.id ? 1 : 0, y: isHovered === barber.id ? 0 : 10 }}
                                            transition={{ delay: isHovered === barber.id ? item.delay : 0, duration: 0.3 }}
                                            className="p-2 bg-gray-700 text-white rounded-full"
                                        >
                                            {item.icon}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Barbers;
