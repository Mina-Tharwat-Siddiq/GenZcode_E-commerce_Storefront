import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../api";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

//* قائمة المستخدمين المحليين 
const LOCAL_USERS = [
    {
        id: 1,
        username: 'user1',
        password: 'user123',
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'user1@example.com',
        role: 'user',
        accessToken: 'local_token_user1_' + Date.now()
    },
    {
        id: 2,
        username: 'user2',
        password: 'user456',
        firstName: 'فاطمة',
        lastName: 'علي',
        email: 'user2@example.com',
        role: 'user',
        accessToken: 'local_token_user2_' + Date.now()
    },
    {
        id: 3,
        username: 'admin',
        password: 'admin123',
        firstName: 'مدير',
        lastName: 'النظام',
        email: 'admin@example.com',
        role: 'admin',
        accessToken: 'local_token_admin_' + Date.now()
    },
    {
        id: 4,
        username: 'test',
        password: 'test123',
        firstName: 'مستخدم',
        lastName: 'تجريبي',
        email: 'test@example.com',
        role: 'user',
        accessToken: 'local_token_test_' + Date.now()
    }
];

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}


export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user_auth");
        return userData ? JSON.parse(userData) : null;
    });

    // Helper: load users that تم تسجيلهم من واجهة التسجيل
    const getRegisteredUsers = () => {
        const stored = localStorage.getItem("registered_users");
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    };

    // Helper: دمج المستخدمين المحليين الأصليين مع المسجلين
    const getAllLocalUsers = () => {
        const dynamicUsers = getRegisteredUsers();
        return [...LOCAL_USERS, ...dynamicUsers];
    };

    useEffect(() => {
        (user?.accessToken) ? setAuthToken(user.accessToken) : setAuthToken(null);
    });

    const login = async (username, password) => {
        // التحقق من أن البيانات غير فارغة
        if (!username || !password || username.trim() === '' || password.trim() === '') {
            toast.error("يرجى إدخال اسم المستخدم وكلمة المرور", {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
        }

        // التحقق من المستخدمين المحليين (الأساسيين + المسجلين من الواجهة) أولاً
        const localUser = getAllLocalUsers().find(
            u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password
        );

        if (localUser) {
            const AuthData = {
                accessToken: localUser.accessToken,
                id: localUser.id,
                firstName: localUser.firstName,
                lastName: localUser.lastName,
                username: localUser.username,
                role: localUser.role,
                email: localUser.email,
            }
            
            setUser(AuthData);
            localStorage.setItem('user_auth', JSON.stringify(AuthData));
            
            toast.success("تم تسجيل الدخول بنجاح", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // إذا لم يتم العثور على مستخدم محلي، جرب API الخارجي
        try {
            const res = await api.post('/auth/login', { username, password });
            
            // التحقق من أن الاستجابة تحتوي على البيانات المطلوبة
            if (!res.data || !res.data.id) {
                throw new Error('فشل تسجيل الدخول - بيانات غير صحيحة');
            }

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
            
            toast.success("تم تسجيل الدخول بنجاح", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || 'اسم المستخدم أو كلمة المرور غير صحيحة';
            toast.error(errorMessage, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            throw e; // إعادة رمي الخطأ لإيقاف عملية تسجيل الدخول
        }
    }

    // دالة لإنشاء حساب جديد + تسجيل الدخول مباشرة
    const register = async ({ firstName, lastName, email, username, password }) => {
        // تحقق من البيانات
        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !username?.trim() || !password?.trim()) {
            toast.error("يرجى إدخال جميع البيانات المطلوبة", {
                position: "top-center",
                autoClose: 2000,
            });
            throw new Error("البيانات غير مكتملة");
        }

        const allUsers = getAllLocalUsers();

        // التحقق من عدم تكرار اسم المستخدم أو الإيميل
        const isExistingUser = allUsers.some(
            (u) =>
                u.username.toLowerCase() === username.toLowerCase().trim() ||
                (u.email && u.email.toLowerCase() === email.toLowerCase().trim())
        );

        if (isExistingUser) {
            toast.error("اسم المستخدم أو البريد الإلكتروني مستخدم من قبل", {
                position: "top-center",
                autoClose: 2000,
            });
            throw new Error("المستخدم موجود بالفعل");
        }

        // إنشاء مستخدم محلي جديد
        const newUser = {
            id: Date.now(),
            username: username.trim(),
            password: password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            role: "user",
            accessToken: "local_token_" + Date.now(),
        };

        // حفظه في localStorage ضمن registered_users
        const currentRegistered = getRegisteredUsers();
        const updatedRegistered = [...currentRegistered, newUser];
        localStorage.setItem("registered_users", JSON.stringify(updatedRegistered));

        // تجهيز بيانات الـ Auth وتسجيل الدخول مباشرة
        const AuthData = {
            accessToken: newUser.accessToken,
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            role: newUser.role,
            email: newUser.email,
        };

        setUser(AuthData);
        localStorage.setItem("user_auth", JSON.stringify(AuthData));

        toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح", {
            position: "top-center",
            autoClose: 1500,
        });
    };

    // دالة للحصول على بيانات المستخدمين المحليين (للعرض في صفحة Login)
    const getLocalUsers = () => {
        return getAllLocalUsers();
    };

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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, getLocalUsers }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;