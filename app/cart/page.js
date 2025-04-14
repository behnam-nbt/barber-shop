import Layout from '@/components/layout/Layout'
import CartPage from '@/components/template/CartPage'
import { fetchCart, fetchProducts } from '@/services/fetchData'
import React from 'react'

export const dynamic = "force-dynamic";

export const metadata = {
    title: "سبد خرید"
}

async function Cart({cartCount, setCartCount}) {
    const carts = await fetchCart();
    const products = await fetchProducts();
    return (
        <Layout>
            <CartPage carts={carts} products={products} cartCount={cartCount} setCartCount={setCartCount} />
        </Layout>
    )
}

export default Cart