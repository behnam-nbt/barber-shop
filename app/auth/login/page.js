"use client";  // Add this line at the top

import Layout from '@/components/layout/Layout'
import CheckOtp from '@/components/module/CheckOtp';
import SendOtp from '@/components/module/SendOtp';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Login() {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user !== null) {
            const redirectPath = localStorage.getItem("redirectAfterLogin");
            router.push(redirectPath);
            localStorage.removeItem("redirectAfterLogin");
        }
    }, [user, loading, router]);


    return (
        <Layout>
            {step === 1 && <SendOtp setOtp={setOtp} setStep={setStep} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
            {step === 2 && <CheckOtp otp={otp} setOtp={setOtp} phoneNumber={phoneNumber} setStep={setStep} />}
        </Layout>
    )
}

export default Login;
