import Layout from '@/components/layout/Layout'
import CartPage from '@/components/template/CartPage'
import { fetchCart, fetchProducts } from '@/services/fetchData'
import React from 'react'

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