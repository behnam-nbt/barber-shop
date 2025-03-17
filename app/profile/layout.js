'use client'
import Layout from '@/components/layout/Layout';
import ProfileSideBar from '@/components/module/ProfileSideBar';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function layout({ children }) {
    const { user, loading, logout } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/not-found");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div>
                <div className="grid grid-cols-[1fr_4fr] gap-20 py-10">
                    <ProfileSideBar />
                    <main className="admin-content">{children}</main>
                </div>
            </div>  
        </Layout>
    )
}

export default layout