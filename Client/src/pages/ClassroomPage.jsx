import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore'; // Import authStore

const ClassroomPage = () => {
    const [assignments, setAssignments] = useState({ active: [], missed: [], completed: [] });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('active');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [newAssignment, setNewAssignment] = useState({ assignmentName: '', description: '', dueDate: '' }); // State for new assignment
    const [testCases, setTestCases] = useState([]); // State for test cases
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const userRole = useAuthStore((state) => state.authUser?.role); // Fetch user role from authStore

    useEffect(() => {
        fetchAssignments();
    }, [classroomId]);

    const fetchAssignments = async () => {
        try {
            const response = await axiosInstance.get(`/classroom/${classroomId}/assignments`);
            if (userRole === 'instructor') {
                // For instructors, show all assignments without filtering
                setAssignments({
                    active: response.data.active.concat(response.data.missed, response.data.completed),
                    missed: [],
                    completed: [],
                });
            } else {
                // For students, keep assignments grouped by status
                setAssignments(response.data);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignmentClick = (assignmentId) => {
        navigate(`/assignment/${assignmentId}`);
    };

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', output: '' }]);
    };

    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[index][field] = value;
        setTestCases(updatedTestCases);
    };

    const handleRemoveTestCase = (index) => {
        const updatedTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(updatedTestCases);
    };

    const handleCreateAssignment = async () => {
        try {
            const payload = {
                ...newAssignment,
                classroomId,
                testCases, // Include test cases in the payload
            };

            console.log("Payload being sent:", payload); // Debugging log

            const response = await axiosInstance.post('/classroom/createAssignment', payload);
            setShowModal(false);
            fetchAssignments(); // Refresh assignments after creation
        } catch (error) {
            console.error('Error creating assignment:', error.response?.data || error.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/classrooms')} 
                        className="btn btn-ghost text-primary flex items-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Classrooms</span>
                    </button>
                    {userRole === 'instructor' && ( // Render button only for instructors
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                        >
                            + Add Assignment
                        </button>
                    )}
                    {userRole === 'student' && ( // Show filters only for students
                        <div className="flex gap-2 ml-auto">
                            <button 
                                onClick={() => setActiveFilter('active')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    activeFilter === 'active' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Active ({assignments.active.length})
                            </button>
                            <button 
                                onClick={() => setActiveFilter('missed')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    activeFilter === 'missed' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Missed ({assignments.missed.length})
                            </button>
                            <button 
                                onClick={() => setActiveFilter('completed')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    activeFilter === 'completed' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Completed ({assignments.completed.length})
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal for Creating Assignment */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Create New Assignment</h2>
                            <input
                                type="text"
                                placeholder="Assignment Name"
                                value={newAssignment.assignmentName}
                                onChange={(e) => setNewAssignment({ ...newAssignment, assignmentName: e.target.value })}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <textarea
                                placeholder="Description"
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <input
                                type="date"
                                value={newAssignment.dueDate}
                                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                className="w-full mb-3 p-2 border rounded"
                            />

                            {/* Test Cases Section */}
                            <div className="mb-4">
                                <h3 className="text-md font-semibold mb-2">Test Cases</h3>
                                {testCases.map((testCase, index) => (
                                    <div key={index} className="mb-2 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Input"
                                            value={testCase.input}
                                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Output"
                                            value={testCase.output}
                                            onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <button
                                            onClick={() => handleRemoveTestCase(index)}
                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddTestCase}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    + Add Test Case
                                </button>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateAssignment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <section className="mb-8">
                    <div className="grid gap-4">
                        {userRole === 'instructor' 
                            ? assignments.active.map((assignment) => ( // Show all assignments for instructors
                                <div
                                    key={assignment._id}
                                    onClick={() => handleAssignmentClick(assignment._id)}
                                    className="bg-base-200 border border-base-300 rounded-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 p-6 cursor-pointer"
                                >
                                    <h3 className="font-semibold text-lg mb-2 text-primary">{assignment.assignmentName}</h3>
                                    <p className="text-base-content/70 mb-3">{assignment.description}</p>
                                    <p className="text-sm text-base-content/50">
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                            : assignments[activeFilter].map((assignment) => ( // Show filtered assignments for students
                                <div
                                    key={assignment._id}
                                    onClick={() => handleAssignmentClick(assignment._id)}
                                    className="bg-base-200 border border-base-300 rounded-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 p-6 cursor-pointer"
                                >
                                    <h3 className="font-semibold text-lg mb-2 text-primary">{assignment.assignmentName}</h3>
                                    <p className="text-base-content/70 mb-3">{assignment.description}</p>
                                    <p className="text-sm text-base-content/50">
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        }
                        {assignments[activeFilter].length === 0 && userRole === 'student' && (
                            <div className="text-center p-8 text-base-content/50">
                                No {activeFilter} assignments found
                            </div>
                        )}
                        {assignments.active.length === 0 && userRole === 'instructor' && (
                            <div className="text-center p-8 text-base-content/50">
                                No assignments found
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ClassroomPage;
