import React, { useEffect,useState } from 'react'
import { useClasroomStore } from '../store/useClassroomStore'
import { useAuthStore } from '../store/useAuthStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from "lucide-react";

const Sidebar = () => {
    //const {getUsers,users,selectedUser,setSelectedUser,isUsersLoading}=useClasroomStore();
    const {getClassrooms,classrooms,selectedClassroom,setSelectedClassroom,isClassroomLoading}=useClasroomStore();


    // get all users to list at the sidebar
    useEffect(()=>{
        getClassrooms();
    },[getClassrooms]);

    // loading screen
    if(isClassroomLoading) return <SidebarSkeleton/>;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
          <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Classrooms</span>
            </div>
          </div>
    
          {/* Display classrooms in the sidebar */}
          <div className="overflow-y-auto w-full py-3">
            {classrooms.classrooms.map((classroom) => (
              <button
                key={classroom._id}
                onClick={() => setSelectedClassroom(classroom)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors
                  ${
                    selectedClassroom?._id === classroom._id
                      ? 'bg-base-300 ring-1 ring-base-300'
                      : ''
                  }
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={classroom.image || 'classroom-placeholder.png'}
                    alt={classroom.name}
                    className="size-12 object-cover rounded-full"
                  />
                </div>
    
                {/* Classroom info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{classroom.name}</div>
                  <div className="text-sm text-zinc-400">{classroom.description || 'No description'}</div>
                </div>
              </button>
            ))}
    
            {classrooms.length === 0 && (
              <div className="text-center text-zinc-500 py-4">No classrooms available</div>
            )}
          </div>
        </aside>
      );
    };
    
    export default Sidebar;