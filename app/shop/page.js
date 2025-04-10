import Layout from '@/components/layout/Layout'
import ShopPage from '@/components/template/ShopPage'
import { fetchProducts } from '@/services/fetchData'
import React from 'react'

export const revalidate = 3600;

async function Shop({ setCartCount, setFavoriteCount }) {
    const products = await fetchProducts();
    return (
        <Layout>
            <ShopPage products={products} setCartCount={setCartCount} setFavoriteCount={setFavoriteCount} />
        </Layout>
    )
}

export default Shop