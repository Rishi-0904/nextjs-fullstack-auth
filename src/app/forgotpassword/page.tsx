"use client"
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";


export default function forgotpasswordPage() {

    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [changed, changing] = useState(false);
    const [error, setError] = useState(false);


    const changePassword = async () => {
        try {
            await axios.post('/api/users/changepassword', { password, token })
            console.log("changed password successfully");
        } catch (error: any) {
            setError(true);
            console.log(error.reponse.data);

        }

    }
    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken);
    }, []);

    if (token.length > 0) {
        changing(true);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <h1 className="text-4xl">Change Password</h1>

            <div>
                <h2 className="text-2xl">New Password</h2>
                <input type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="p-2 border border-gray-300 rounded-lg"
                />
                <button onClick={changePassword} className="p-2 bg-blue-500 text-white rounded-lg">Change Password</button>
            </div>

            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>

                </div>
            )}
        </div>
    )

}