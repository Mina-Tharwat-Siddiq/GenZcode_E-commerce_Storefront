// src/components/AdminHeader.jsx
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminHeader() {
    const location = useLocation();
    const { logout } = useAuth();
    
    //Get Path
    const currentPage = location.pathname.split('/').pop() || 'Dashboard';
    const pageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
    return (
        <div className="d-flex justify-content-between align-items-center p-3">
            {/* Path */}
            <div className="text-muted">
                Admin &gt; <strong className="text-gray">{pageName}</strong>
            </div>

            {/* LogOut Button*/}
            <button onClick={logout} className="btn btn-sm ">
                <i className="bi bi-box-arrow-right me-2"></i> 
            </button>
        </div>
    );
}

export default AdminHeader;