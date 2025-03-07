'use client'

import Sidebar from "@/components/module/back/Sidebar";
import { useUser } from "@/context/AuthContext"
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function layout({ children }) {
    const { user, loading, logout } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user === null) return;
        if (!loading && user?.role !== "admin") {
            router.push("/not-found");
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {user?.role === "admin" ? (
                <>
                    <div>
                        <p>خوش آمدی، {digitsEnToFa(user.phoneNumber)}</p>
                    </div>
                    <div className="grid grid-cols-[1fr_4fr] py-10">
                        <Sidebar logout={logout} />
                        <main className="admin-content">{children}</main>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default layout