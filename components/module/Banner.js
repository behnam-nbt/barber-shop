import Link from "next/link";
import React from "react";

function Banner() {
    return (
        <div className="relative w-full h-[100vh]">
            {/* Fixed Background */}
            <div className="fixed top-0 left-0 w-full h-[100vh] -z-10"
                style={{
                    background: "url('/images/main-image.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
            </div>

            {/* Text that scrolls up */}
            <div className="h-[100vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg text-zinc-400">
                        اصلاحی بی‌نظیر و خاص
                    </h1>
                    <h1 className="text-5xl md:text-6xl font-bold text-yellow-200 drop-shadow-lg mt-6">
                        با بهترین خدمات و کیفیت
                    </h1>
                    <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-8">در محیطی شیک و راحت</p>
                    <Link href="#" className="text-xl md:text-2xl bg-orange-400 text-white px-10 py-2 rounded-md">رزرو صندلی</Link>
                </div>
            </div>
        </div>
    );
}

export default Banner;
