import { NavLink , Link } from "react-router-dom";
import AdminLogo from '../assets/Admin.svg';
import './SideBar.css';
import { useState } from "react";
function SideBar() {
    const [textColor, setTextColor] = useState("#5C5F6A")
    return (
        <div className="offcanvas offcanvas-start bg-light" tabIndex="-1" id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">
                    <img src={AdminLogo} alt="Admin Logo" style={{ maxWidth: '116px', height: '40px' , margin:"0 auto"}} />
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="nav nav-pills flex-column mb-auto ulLinks">
                    <li className="nav-item mb-3">
                        <NavLink to="." end className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item mb-3">
                        <NavLink to={"products"} className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-box me-2"></i> Products
                        </NavLink>
                    </li>
                    <li className="nav-item mb-3">
                        <NavLink to={"Orders"} className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-cart me-2"></i> Orders
                        </NavLink>
                    </li>
                    <li className="nav-item mb-3">
                        <NavLink to={"Customers"} className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-people me-2"></i> Customers
                        </NavLink>
                    </li>
                    <li className="nav-item mb-3">
                        <NavLink to={"Reviews"} className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-star me-2"></i> Reviews
                        </NavLink>
                    </li>
                    <li className="nav-item mb-3">
                        <NavLink to={"admins"} className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-person-fill-gear me-2"></i> Admins
                        </NavLink>
                    </li>
                    {/* <li className="nav-item mb-3">
                        <NavLink to={"Settings"} className={({isActive})=>isActive?"nav-link active":"nav-link"} aria-current="page" style={{color:textColor}}>
                            <i className="bi bi-gear-wide-connected me-2"></i> Settings
                        </NavLink>
                    </li> */}
                </ul>
            </div>
        </div>
    );
}

export default SideBar;