"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@/context/AuthContext'; // Assuming the token is in the context
import api from '@/api/api'; // Assuming you have your api setup here (if not, set it up)

function Profile() {
    const { user, loading } = useUser(); // Get user data from context
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const token = user.accessToken; // Assuming access token is in context/user
                    const { data } = await api.get('/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setProfileData(data); // Store the fetched user profile data
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchProfile(); // Run the fetch when the component mounts
    }, [user]); // Trigger the effect whenever the user changes

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (!profileData) {
        return <div>No profile data found.</div>; // Show a message if there's no profile data
    }

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
            <p><strong>Created At:</strong> {new Date(profileData.createdAt).toLocaleString()}</p>
            {/* You can add more profile fields here as needed */}
        </div>
    );
}

export default Profile;
