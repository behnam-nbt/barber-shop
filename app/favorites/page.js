import Layout from '@/components/layout/Layout'
import FavoritePage from '@/components/template/FavoritePage';
import { fetchFavorites, fetchProducts } from '@/services/fetchData'
import React from 'react'

export const dynamic = "force-dynamic";

async function Favorites({favoriteCount, setFavoriteCount}) {
    const likes = await fetchFavorites();
    const products = await fetchProducts();
    return (
        <Layout>
            <FavoritePage likes={likes} products={products} favoriteCount={favoriteCount} setFavoriteCount={setFavoriteCount} />
        </Layout>
    )
}

export default Favorites