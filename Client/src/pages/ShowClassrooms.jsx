import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore'; // Import the auth store

const ClassroomsPage = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [formData, setFormData] = useState({
        classroomName: '',
        description: '',
        classroomCode: '',
    });
    const { authUser } = useAuthStore(); // Get the authenticated user
    const navigate = useNavigate();

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

    const handleClassroomClick = (classroomId) => {
        navigate(`/classroom/${classroomId}`);
    };

    const handleCreateClassroom = async () => {
        try {
            const instructorId = authUser._id; // Use the authenticated user's ID
            const response = await axiosInstance.post('/classroom/createClassroom', {
                ...formData,
                instructorId,
            });
            alert('Classroom created successfully!');
            setIsPopupVisible(false);
            fetchClassrooms(); // Refresh the classroom list
        } catch (error) {
            console.error('Error creating classroom:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to create classroom.');
        }
    };

    return (
        <div className="p-6 pt-24 bg-base-100 text-base-content min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-ghost text-primary mr-4 flex items-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="text-3xl font-bold text-primary">Your Labs</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classrooms.map((classroom) => (
                        <div 
                            key={classroom._id} 
                            className="bg-base-200 border border-base-300 rounded-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 p-6 cursor-pointer"
                            onClick={() => handleClassroomClick(classroom._id)}
                        >
                            <h4 className="text-xl font-semibold text-primary mb-2">{classroom.classroomName}</h4>
                            <p className="text-base-content/70 mb-4">{classroom.description}</p>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    <span className="font-medium">Code: {classroom.classroomCode}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span className="font-medium">Students: {classroom.enrolledStudents.length}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Classroom Button */}
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => setIsPopupVisible(true)}
                        className="btn btn-primary px-6 py-3 text-lg"
                    >
                        Create New Classroom
                    </button>
                </div>
            </div>

            {/* Popup for Creating Classroom */}
            {isPopupVisible && (
                <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-base-content">Create New Classroom</h3>
                        <input
                            type="text"
                            value={formData.classroomName}
                            onChange={(e) => setFormData({ ...formData, classroomName: e.target.value })}
                            placeholder="Classroom Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-base-content"
                        />
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-base-content"
                        />
                        <input
                            type="text"
                            value={formData.classroomCode}
                            onChange={(e) => setFormData({ ...formData, classroomCode: e.target.value })}
                            placeholder="Classroom Code"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-base-content"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                onClick={() => setIsPopupVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus"
                                onClick={handleCreateClassroom}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomsPage;
