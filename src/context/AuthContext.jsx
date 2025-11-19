import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../api";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}


export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user_auth");
        return userData ? JSON.parse(userData) : null;
    })

    useEffect(() => {
        (user?.accessToken) ? setAuthToken(user.accessToken) : setAuthToken(null);
    });

    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            // Get User Role By User Login Id
            const userRes = await api.get(`/users/${res.data.id}`);
            const userRole = userRes.data;
            
            const AuthData = {
                accessToken: res.data.accessToken,
                id: res.data.id,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                username: res.data.username,
                role: userRole.role,
                email: res.data.email,
            }
            
            setUser(AuthData);
            localStorage.setItem('user_auth', JSON.stringify(AuthData));
            
            toast.success("Logged in Successfuly", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (e) {
            toast.error(e.response.data.message || 'Somthing Wrong', {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,

            });

        }
    }

    const logout = () => {
        navigate("/login");
        setUser(null);
        localStorage.removeItem('user_auth');
        setAuthToken(null);
        toast.success("Logged Out Successfully",
            {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,

            }
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;