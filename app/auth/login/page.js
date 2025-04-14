import Layout from "@/components/layout/Layout";
import LoginPage from "@/components/module/LoginPage";

export const metadata = {
    title: "ورود"
}

function Login() {
    return (
        <Layout>
            <LoginPage />
        </Layout>
    )
}

export default Login;
