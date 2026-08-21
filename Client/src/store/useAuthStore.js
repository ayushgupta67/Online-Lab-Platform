import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast"


export const useAuthStore = create((set, get) => ({
    authUser: null,

    // loading states
    isSigningUp: false,
    isLoggingIng: false,
    isCheckingAuth: true,

    // to check if user is authenticated---- called every time user refreshes
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data }); // Ensure res.data includes the user's role
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            console.log(data)
            const res = await axiosInstance.post("/auth/register", data);
            //console.log("we got this from server :",res)
            set({ authUser: res.data });
            toast.success("account created successfully");
            get().connectSocket();
        }
        catch (error) {
            toast.error("Error in signup: ", error);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isLoggingIng: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            // redirect user to login page
            window.location.href = "/login";
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

}));
