'use client';

import { useState } from "react";
import OtpInput from "react18-input-otp";
import { setTokens } from '@/utils/tokenHandler';
import { useCheckOtp } from "@/utils/auth";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import api from "@/api/api";

function CheckOtp({ setStep, phoneNumber, otp, setOtp }) {
    const [manualOtp, setManualOtp] = useState("");
    const [error, setError] = useState("");
    const { mutate: checkOtp, isLoading } = useCheckOtp();
    const router = useRouter();
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);

    const handleOtpChange = (otpValue) => {
        setManualOtp(otpValue);
        if (otpValue.length === 6) {
            submitHandler(null, otpValue);
        }
    }

    const submitHandler = (e, enteredOtp = manualOtp) => {
        if (e) e.preventDefault();
        if (enteredOtp.length !== 6) {
            setError("کد تایید باید ۶ رقمی باشد");
            return;
        }

        setLoading(true);

        checkOtp(
            { phoneNumber, otp: enteredOtp },
            {
                onSuccess: async (response) => {
                    const { accessToken, refreshToken } = response.data;

                    if (accessToken && refreshToken) {
                        setTokens({ accessToken, refreshToken });
                        try {
                            const { data: userProfile } = await api.get('/api/user/profile');

                            setUser(userProfile);
                        } catch (error) {
                            console.error("Error fetching user profile:", error);
                            setError("خطا در دریافت اطلاعات کاربری");
                        }
                        handleLogin();
                    } else {
                        setError('خطا در احراز هویت');
                    }
                    // setLoading(false);
                },
                onError: (error) => {
                    console.error("API Error:", error.response?.data || error.message);
                    setError("کد تایید معتبر نمی باشد");
                    setManualOtp("");
                    setLoading(false);
                },
            }
        );
    };

    const handleLogin = () => {
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        router.push(redirectPath); // Redirect after successful login
        localStorage.removeItem("redirectAfterLogin");
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
            <div className="w-[400px] min-h-[200px] border border-zinc-400 rounded-md p-2">
                <Image className="w-40 h-auto mx-auto" src="/images/logo.png" width={1200} height={900} alt="Logo" />
                <form onSubmit={submitHandler}>
                    <h2>کد تایید را وارد کنید</h2>
                    <p>کد تایید به شماره {digitsEnToFa(phoneNumber)} ارسال شد.</p>

                    <div style={{ display: "flex", justifyContent: "center", direction: "ltr", marginTop: "1rem" }}>
                        <OtpInput
                            value={manualOtp}
                            onChange={handleOtpChange}
                            numInputs={6}
                            inputStyle={{
                                border: "1px solid silver",
                                borderRadius: "5px",
                                width: "49px",
                                height: "45px",
                                marginRight: "5px",
                                justifyContent: "center",
                                backgroundColor: "var(--background-color)",
                                color: "var(--text-color)"
                            }}
                        />
                    </div>
                    <p className="text-center">
                        کد تایید شما: {otp}
                    </p>

                    {!!error && <p style={{ color: "red" }}>{error}</p>}

                    <button className="mt-4 px-4 py-2 w-full bg-zinc-500 rounded-md text-white hover:bg-white hover:text-zinc-900 hover:border hover:border-zinc-600" type="submit" disabled={loading}>
                        {loading ? 'در حال ارسال...' : 'ورود'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckOtp;
