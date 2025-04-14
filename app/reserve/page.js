import Layout from '@/components/layout/Layout'
import ReservePage from '@/components/template/ReservePage'
import { fetchBarbers, fetchCategories } from '@/services/fetchData'
import React from 'react'

export const metadata = {
    title: "رزرو صندلی"
}

async function Reserve() {
    const barbers = await fetchBarbers();
    const categories = await fetchCategories();
    return (
        <Layout>
            <ReservePage barbers={barbers} categories={categories} />
        </Layout>
    )
}

export default Reserve