import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants/index.js';

const SettingsPage = () => {
    const { authUser } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-base-100 text-base-content">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus"
                >
                    Back
                </button>
                <div className="bg-base-100 p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">User Details</h1>
                    {authUser ? (
                        <div>
                            <p><strong>Name:</strong> {authUser.firstName} {authUser.lastName}</p>
                            <p><strong>Email:</strong> {authUser.email}</p>
                            <p><strong>Role:</strong> {authUser.role}</p>
                        </div>
                    ) : (
                        <p>No user details available.</p>
                    )}
                </div>
                <div className="bg-base-100 p-6 rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-bold mb-4">Theme Selection</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {THEMES.map((t) => (
                            <button
                                key={t}
                                className={`
                                    group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                                    ${theme === t ? "bg-primary/10" : "hover:bg-base-200/50"}
                                `}
                                onClick={() => setTheme(t)}
                            >
                                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                        <div className="rounded bg-primary"></div>
                                        <div className="rounded bg-secondary"></div>
                                        <div className="rounded bg-accent"></div>
                                        <div className="rounded bg-neutral"></div>
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium truncate w-full text-center">
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;