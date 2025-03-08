"use client";  // Add this line at the top

import Layout from '@/components/layout/Layout'
import CheckOtp from '@/components/module/CheckOtp';
import SendOtp from '@/components/module/SendOtp';
import React, { useState } from 'react'

function Login() {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");


    return (
        <Layout>
            {step === 1 && <SendOtp setOtp={setOtp} setStep={setStep} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
            {step === 2 && <CheckOtp otp={otp} setOtp={setOtp} phoneNumber={phoneNumber} setStep={setStep} />}
        </Layout>
    )
}

export default Login;
