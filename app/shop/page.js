import Layout from '@/components/layout/Layout'
import ShopPage from '@/components/template/ShopPage'
import { fetchProducts } from '@/services/fetchData'
import React from 'react'

export const revalidate = 3600;

async function Shop() {
    const products = await fetchProducts();
    return (
        <Layout>
            <ShopPage products={products} />
        </Layout>
    )
}

export default Shop