import Layout from '@/components/layout/Layout'
import CheckoutPage from '@/components/template/CheckoutPage'
import React from 'react'

export const metadata = {
    title: "نهایی کردن خرید"
}

function Checkout() {
    return (
        <Layout>
            <CheckoutPage />
        </Layout>
    )
}

export default Checkout