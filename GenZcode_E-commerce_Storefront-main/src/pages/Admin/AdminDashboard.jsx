import { Outlet, Route, Routes } from "react-router-dom";
import SideBar from "../../components/SideBar";
import AdminHeader from "../../components/ِAdminHeader";

function AdminDashboard() {
    return (
        <div style={{ background: "#F1AE60", width: "100%", minHeight:"100vh"}}>
            <SideBar />
            <button className="btn d-lg-none ms-2 mt-2" style={{background:"white"}} type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas">
                <i className="bi bi-list"></i>
            </button>
            <div className="main-content" style={{padding:"20px"}}>
            <AdminHeader/>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboard;
