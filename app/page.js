import Layout from "@/components/layout/Layout";
import ThemeToggle from "@/components/module/ThemeToggle";
import HomePage from "@/components/template/HomePage";
import { fetchBlogs } from "@/services/fetchData";

async function Home() {
  const blogs = await fetchBlogs();
  console.log(blogs);
  return (
    <Layout>
      <HomePage blogs={blogs} />
    </Layout>
  );
}

export default Home;