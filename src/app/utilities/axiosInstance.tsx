import axios from "axios";
import { logOut } from "./logout";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "",
//   timeout: 10000, // Set a timeout for requests if we want to
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      // Clear token and log out the session
      // if(error.response.data.statusMessage.includes("expired")){  
        // logOut()
        localStorage.removeItem("loginResponse");
        localStorage.clear();
        toast.error("Token Expired. Please Login Again.")
        // Redirect the user to the login page
        setTimeout(()=>{
          window.location.href = "/login";
        },3000)
        
      // }
      return Promise.reject(error);
    }


    // Reject other errors
    return Promise.reject(error);
  }
);

export default api;