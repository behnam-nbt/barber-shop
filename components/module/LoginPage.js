"use client";  // Add this line at the top

import CheckOtp from './CheckOtp';
import SendOtp from './SendOtp';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function LoginPage() {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user !== null) {
            const redirectPath = localStorage.getItem("redirectAfterLogin");
            router.push("/reserve");
            localStorage.removeItem("redirectAfterLogin");
        }
    }, [user, loading, router]);


    return (
        <>
            {step === 1 && <SendOtp setOtp={setOtp} setStep={setStep} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
            {step === 2 && <CheckOtp otp={otp} setOtp={setOtp} phoneNumber={phoneNumber} setStep={setStep} />}
        </>
    )
}

export default LoginPage;
