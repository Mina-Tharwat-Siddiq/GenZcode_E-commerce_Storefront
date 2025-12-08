import { createContext, useContext, useEffect, useState } from "react";
import { authAPI, usersAPI } from "../api";
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
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    });


    // useEffect(() => {
    //     (user?.accessToken) ? setAuthToken(user.accessToken) : setAuthToken(null);
    // });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, [])


    const register = async (userData) => {
        try {
            const { data } = await authAPI.register(userData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.response?.data?.message || 'Registration failed' };
        }
    };

    const login = async (credentials) => {
        try {
            const { data } = await authAPI.login(credentials);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            setUser(data.user);
            
            return { success: true };
        } catch (e) {
            return { success: false, error: e.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        // localStorage.removeItem('user_auth');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // setAuthToken(null);
        setUser(null);
        toast.success("Logged Out"
            , {
                icon: 'Success',
                style: { background: '#d4edda', color: '#155724' }
            }
        );
        navigate("/login");
    };

    const refreshUser = async () => {
        try {
            const { data } = await usersAPI.getCurrent();
            setUser(data.user);
        } catch (e) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;