import { Navigate, Route, Routes } from 'react-router-dom'
//import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'

import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore.js'
import HomePage from "./pages/HomePage.jsx";
import ShowClassrooms from './pages/ShowClassrooms.jsx'
import ClassroomPage from './pages/ClassroomPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import EditorPage from "./pages/EditorPage.jsx"

function App() {
  const {authUser,checkAuth,isCheckingAuth}= useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[]);

  console.log({authUser});

  // diaplaying Loader while authenticating the user
  if(isCheckingAuth && authUser){
    return (
      <div className='flex items-center justify-center h-screen' data-theme={theme}>
        <Loader className = "size-10 animate-spin"/>
      </div>
    )
  }
 
  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content">
      <Navbar/>

      <Routes>
        <Route path="/Homepage" element={<HomePage />} />
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/login' element={ !authUser ? <LoginPage/>  : < Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage/> : < Navigate to="/" />} />
        {/* <Route path='/classrooms' element={authUser ? <ShowClassrooms/> : <Navigate to="/login" />} /> */}
        <Route path='/classrooms' element={ <ShowClassrooms/> } />
        <Route path='/classroom/:classroomId' element={<ClassroomPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/assignment/:assignmentId' element={<EditorPage />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
