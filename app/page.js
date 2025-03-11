import Layout from "@/components/layout/Layout";
import ThemeToggle from "@/components/module/ThemeToggle";
import HomePage from "@/components/template/HomePage";
import { fetchBarbers, fetchBlogs } from "@/services/fetchData";

async function Home() {
  const blogs = await fetchBlogs();
  const barbers = await fetchBarbers();

  return (
    <Layout>
      <HomePage blogs={blogs} barbers={barbers} />
    </Layout>
  );
}

export default Home;