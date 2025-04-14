import Layout from "@/components/layout/Layout"
import { fetchProducts, fetchProductBySlug } from "@/services/fetchData"
import ProductDetailsPage from "@/components/template/ProductDetailsPage"

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { slug } = params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        return {
            title: "Product not found",
        };
    }

    return {
        title: product.title
    };
}


export async function generateStaticParams() {
    try {
        const products = await fetchProducts();
        if (!Array.isArray(products)) {
            throw new Error("خطا در دریافت محصولات!");
        }
        return products.map((product) => ({
            slug: product.slug
        }))
    } catch (error) {
        console.error("خطا در دریافت محصول!", error);
    }
}

async function ProductDetails({ params }) {
    const { slug } = await params;
    const products = await fetchProducts();
    const product = await fetchProductBySlug(slug);
    return (
        <Layout>
            <ProductDetailsPage product={product} products={products} />
        </Layout>
    )
}

export default ProductDetails