import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // Import the auth store
import { axiosInstance } from '../lib/axios.js'; // Import axios instance

const HomePage = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [username, setUsername] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [showClassrooms, setShowClassrooms] = useState(false);
    const navigate = useNavigate();
    const { authUser } = useAuthStore(); // Get the authenticated user

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/classroom');
            const data = await response.json();
            setClassrooms(data);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        }
    };

    const handleJoinClick = () => {
        if (authUser?.role !== 'instructor') {
            alert('Only instructors can join a class.');
            return;
        }
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setClassCode('');
        setUsername('');
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post('/classroom/addStudents', {
                classCode,
                username,
            });
            alert('Successfully added the student to the class!');
            setIsPopupVisible(false);
            setClassCode('');
            setUsername('');
        } catch (error) {
            console.error('Error adding student to class:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to add the student. Please check the class code and username.');
        }
    };

    const handleViewLabs = () => {
        navigate('/classrooms');
    };

    return (
        <div className="p-6 font-sans text-base-content bg-base-100 min-h-screen flex flex-col items-center pt-20">
            <header className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-primary">Welcome to the ByteForge</h1>
                <h1 className="text-5xl font-extrabold text-primary">Online Lab Platform</h1>
                <p className="text-base-content/70 mt-4 text-lg">Your gateway to interactive learning and experimentation</p>
            </header>
            <main className="w-full max-w-4xl">
                <section className="mb-12 bg-base-200 shadow-lg rounded-lg p-6">
                    <h2 className="text-3xl font-semibold text-primary">Explore Labs</h2>
                    <p className="text-base-content/70 mt-3 text-lg">Browse through a variety of labs and start experimenting today.</p>
                    <button 
                        className="btn btn-primary mt-6 px-6 py-3 text-lg"
                        onClick={handleViewLabs} // Added onClick handler
                    >
                        View Labs
                    </button>
                </section>
                {authUser?.role === 'instructor' && (
                    <section className="mb-12 bg-base-200 shadow-lg rounded-lg p-6">
                        <h2 className="text-3xl font-semibold text-success">Add Students</h2>
                        <p className="text-base-content/70 mt-3 text-lg">Add Students to Classroom using class code and Username </p>
                        <button
                            className="btn btn-success mt-6 px-6 py-3 text-lg"
                            onClick={handleJoinClick}
                        >
                            Join Now
                        </button>
                    </section>
                )}
            </main>
            {isPopupVisible && (
                <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-base-content">Enter Class Code and Username</h3>
                        <input
                            type="text"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            placeholder="Enter class code"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-base-content"
                        />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-base-content"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                onClick={handleClosePopup}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
