
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">

                <Link className="navbar-brand fw-bold" to="/">
                    Employee Management
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMenu">

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">

                            <NavLink className="nav-link" to="Pages/employees">
                                Employees
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="Pages/add-employee">
                                Add Employee
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="Pages/departments">
                                Departments
                            </NavLink>
                        </li>

                    </ul>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
