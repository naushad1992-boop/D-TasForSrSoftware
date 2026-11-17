
import React from 'react';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Navbar from './Navbar';
import Home from './Pages/Home';
import EmployeeAPI from './Pages/EmployeeAPI';
import DepartmentAPI from './Pages/DepartmentAPI';

function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Home Page */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Employee CRUD */}
                <Route
                    path="/Pages/employees"
                    element={<EmployeeAPI />}
                />

                <Route
                    path="/Pages/add-employee"
                    element={<EmployeeAPI />}
                />

                {/* Department CRUD */}
                <Route
                    path="/Pages/departments"
                    element={<DepartmentAPI />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
