import React from "react";
import HeaderBar from "../Bank/HeaderBar/HeaderBar";
import { Link } from "react-router-dom";

const AdminHeader = () => {

    return (
        <HeaderBar
            showLinks={() => {
                return (
                    <div>
                        <Link to="/admin">Overview</Link>
                        <Link to="/admin/timings">Timings</Link>
                        <Link to="/admin/users">Users</Link>
                    </div>
                )
            }}
            link="/admin"
            tagline="Administration Panel"
        />
    )

}

export default AdminHeader;
