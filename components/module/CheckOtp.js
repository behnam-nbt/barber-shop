'use client';

import { useState } from "react";
import OtpInput from "react18-input-otp";
import { setTokens } from '@/utils/tokenHandler';
import { useCheckOtp } from "@/utils/auth";

function CheckOtp({ setStep, phoneNumber }) {
    const [otp, setOtp] = useState("");  // ✅ Ensure OTP is properly stored
    const [error, setError] = useState("");
    const { mutate: checkOtp, isLoading } = useCheckOtp();

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("Sending OTP:", otp); // ✅ Check if OTP is correct before sending

        if (otp.length !== 6) {
            setError("کد تایید باید ۶ رقمی باشد");
            return;
        }

        checkOtp(
            { phoneNumber, otp },
            {
                onSuccess: (response) => {
                    console.log("API Response:", response);  // ✅ Debug API response
                    const { accessToken, refreshToken } = response.data;

                    if (accessToken && refreshToken) {
                        setTokens({ accessToken, refreshToken });
                        window.location.href = '/'; // Redirect on success
                    } else {
                        setError('خطا در احراز هویت');
                    }
                },
                onError: (error) => {
                    console.error("API Error:", error.response?.data || error.message);
                    setError("کد تایید معتبر نمی باشد");
                    setOtp("");
                },
            }
        );
    };

    return (
        <div>
            <form onSubmit={submitHandler}>
                <h2>کد تایید را وارد کنید</h2>
                <p>کد تایید به شماره {phoneNumber} ارسال شد.</p>

                <div style={{ display: "flex", justifyContent: "center", direction: "ltr", marginTop: "1rem" }}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}  // ✅ Ensure OTP updates properly
                        numInputs={6}
                        inputStyle={{
                            border: "1px solid silver",
                            borderRadius: "5px",
                            width: "49px",
                            height: "45px",
                            marginRight: "5px",
                            justifyContent: "center"
                        }}
                    />
                </div>

                {!!error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'در حال ارسال...' : 'ورود'}
                </button>
            </form>
        </div>
    );
}

export default CheckOtp;
