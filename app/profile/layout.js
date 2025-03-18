'use client'
import Layout from '@/components/layout/Layout';
import ProfileSideBar from '@/components/module/ProfileSideBar';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import ClipLoader from "react-spinners/ClipLoader";

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
                <div className='absolute top-1/2 right-1/2'><ClipLoader size={40} color='#d35400' /></div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='min-h-screen'>
                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_4fr] gap-20 py-10">
                    <ProfileSideBar />
                    <main className="admin-content">{children}</main>
                </div>
            </div>
        </Layout>
    )
}

export default layout