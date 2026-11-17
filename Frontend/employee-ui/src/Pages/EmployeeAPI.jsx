
import React, { useEffect, useState } from 'react';

import {
    getEmployees,
    getDepartments,
    addEmployee,
    updateEmployee,
    deleteEmployee
} from '../services/employeeService';

import 'bootstrap/dist/css/bootstrap.min.css';

function EmployeeAPI() {

    // Employee and Department
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // Edit and Delete
    const [editId, setEditId] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Search, Sorting and Pagination
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial Form
    const initialForm = {
        firstName: '',
        lastName: '',
        departmentId: '',
        salary: ''
    };

    const [form, setForm] = useState(initialForm);

    // =====================================
    // GET EMPLOYEES API
    // =====================================

    const loadEmployees = async () => {

        try {

            setLoading(true);

            const response = await getEmployees(
                search,
                sortColumn,
                sortOrder,
                pageNumber,
                pageSize
            );

            console.log('Employee API Response:', response.data);

            const result = response.data;

            // Supports array or paginated API response
            const employeeList = Array.isArray(result)
                ? result
                : (result.data || result.items || []);

            setEmployees(employeeList);

            const records = Array.isArray(result)
                ? employeeList.length
                : (result.totalRecords ?? employeeList.length);

            setTotalRecords(records);

            setTotalPages(
                Array.isArray(result)
                    ? Math.ceil(records / pageSize)
                    : (result.totalPages ?? Math.ceil(records / pageSize))
            );

        }
        catch (error) {

            console.error(
                'Employee API Error:',
                error.response?.data || error.message
            );

            setEmployees([]);
            setTotalRecords(0);
            setTotalPages(0);

        }
        finally {

            setLoading(false);

        }
    };

    // =====================================
    // GET DEPARTMENTS API
    // =====================================

    // const loadDepartments = async () => {

    //     try {

    //         const response = await getDepartments();

    //         console.log('Department API Response:', response.data);

    //         setDepartments(
    //             Array.isArray(response.data) ? response.data : []
    //         );

    //     }
    //     catch (error) {

    //         console.error(
    //             'Department API Error:',
    //             error.response?.data || error.message
    //         );

    //         setDepartments([]);

    //     }
    // };

    const loadDepartments = async () => {
    try {
        const response = await getDepartments();

        console.log("Department Response:", response.data);

        setDepartments(response.data.data || []);

    } catch (error) {
        console.error("Department Error:", error);
        setDepartments([]);
    }
};

    // =====================================
    // USE EFFECT
    // =====================================

    useEffect(() => {

        loadEmployees();

    }, [search, sortColumn, sortOrder, pageNumber, pageSize]);

    useEffect(() => {
debugger;
        loadDepartments();

    }, []);

    // =====================================
    // INPUT CHANGE
    // =====================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = (e) => {

        setSearch(e.target.value);
        setPageNumber(1);

    };

    // =====================================
    // SORTING
    // =====================================

    const handleSort = (column) => {

        if (sortColumn === column) {

            setSortOrder(prev =>
                prev === 'asc' ? 'desc' : 'asc'
            );

        }
        else {

            setSortColumn(column);
            setSortOrder('asc');

        }

        setPageNumber(1);

    };

    const sortIcon = (column) => {

        if (sortColumn !== column) {
            return ' ↕';
        }

        return sortOrder === 'asc' ? ' ↑' : ' ↓';

    };

    // =====================================
    // PAGE SIZE
    // =====================================

    const handlePageSize = (e) => {

        setPageSize(Number(e.target.value));
        setPageNumber(1);

    };

    // =====================================
    // ADD EMPLOYEE
    // =====================================

    const handleAdd = () => {

        setEditId(null);
        setForm(initialForm);
        setShowModal(true);
        loadDepartments();

    };

    // =====================================
    // EDIT EMPLOYEE
    // =====================================

    const handleEdit = (emp) => {

    setEditId(emp.id);

    setForm({
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        departmentId: emp.departmentId ?? '',
        salary: emp.salary ?? ''
    });

    setShowModal(true);
};
    // =====================================
    // SAVE EMPLOYEE API
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            departmentId: Number(form.departmentId),
            salary: Number(form.salary)
        };

        try {

            setSaving(true);

            if (editId !== null) {

                await updateEmployee(editId, data);

                alert('Employee Updated Successfully');

            }
            else {

                await addEmployee(data);

                alert('Employee Added Successfully');

            }

            setShowModal(false);
            setForm(initialForm);
            await loadEmployees();

        }
        catch (error) {

            console.error(
                'Save Employee Error:',
                error.response?.data || error.message
            );

            alert('Save operation failed');

        }
        finally {

            setSaving(false);

        }

    };

    // =====================================
    // DELETE POPUP
    // =====================================

    const handleDeletePopup = (emp) => {

        setSelectedEmployee(emp);
        setShowDelete(true);

    };

    // =====================================
    // DELETE EMPLOYEE API
    // =====================================

    const handleDelete = async () => {

        if (!selectedEmployee) return;

        try {

            await deleteEmployee(selectedEmployee.id);

            setShowDelete(false);
            setSelectedEmployee(null);

            alert('Employee Deleted Successfully');

            if (employees.length === 1 && pageNumber > 1) {

                setPageNumber(prev => prev - 1);

            }
            else {

                await loadEmployees();

            }

        }
        catch (error) {

            console.error(
                'Delete Employee Error:',
                error.response?.data || error.message
            );

            alert('Delete operation failed');

        }

    };

    // =====================================
    // PAGINATION
    // =====================================

    const handlePrevious = () => {

        if (pageNumber > 1) {
            setPageNumber(prev => prev - 1);
        }

    };

    const handleNext = () => {

        if (pageNumber < totalPages) {
            setPageNumber(prev => prev + 1);
        }

    };

    // =====================================
    // UI
    // =====================================

    return (

        <div className="container mt-5 mb-5">

            <div className="card shadow">

                {/* HEADER */}

                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

                    <h4 className="mb-0">
                        Employee Management
                    </h4>

                    <button
                        className="btn btn-light"
                        onClick={handleAdd}
                    >
                        + Add Employee
                    </button>

                </div>

                <div className="card-body">

                    {/* SEARCH AND PAGE SIZE */}

                    <div className="row mb-3 g-3">

                        <div className="col-md-5">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or department..."
                                value={search}
                                onChange={handleSearch}
                            />

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={pageSize}
                                onChange={handlePageSize}
                            >

                                <option value={5}>5 Records</option>
                                <option value={10}>10 Records</option>
                                <option value={20}>20 Records</option>
                                <option value={50}>50 Records</option>

                            </select>

                        </div>

                        <div className="col-md-4 text-end">

                            <strong>
                                Total Records: {totalRecords}
                            </strong>

                        </div>

                    </div>

                    {/* EMPLOYEE TABLE */}

                    <div className="table-responsive">

                        <table className="table table-bordered table-striped table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>

                                    <th
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('firstName')}
                                    >
                                        Name {sortIcon('firstName')}
                                    </th>

                                    <th
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('salary')}
                                    >
                                        Salary {sortIcon('salary')}
                                    </th>

                                    <th>Department</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            Loading employees...
                                        </td>
                                    </tr>

                                ) : employees.length > 0 ? (

                                    employees.map(emp => (

                                        <tr key={emp.id}>

                                            <td>{emp.id}</td>

                                            <td>
                                                {emp.firstName} {emp.lastName}
                                            </td>

                                            <td>
                                                {emp.salary}
                                            </td>

                                            <td>
                                                {emp.departmentName}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEdit(emp)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeletePopup(emp)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No Employee Found
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINATION */}

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                        <div>
                            Showing {employees.length} records
                            {' '}of {totalRecords}
                        </div>

                        <div className="d-flex align-items-center gap-2">

                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={pageNumber <= 1 || loading}
                                onClick={handlePrevious}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pageNumber} of {totalPages}
                            </span>

                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={pageNumber >= totalPages || loading || totalPages === 0}
                                onClick={handleNext}
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================= */}
            {/* ADD / EDIT EMPLOYEE MODAL */}
            {/* ================================= */}

            {showModal && (

                <div
                    className="modal show d-block"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">

                                    {editId !== null
                                        ? 'Edit Employee'
                                        : 'Add New Employee'}

                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                />

                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="modal-body">

                                    {/* FIRST NAME */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    {/* LAST NAME */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    {/* DEPARTMENT */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Department
                                        </label>

                                       <select
    name="departmentId"
    className="form-select"
    value={form.departmentId}
    onChange={handleChange}
    required
>
    <option value="">Select Department</option>

    {departments.map(dept => (
        <option
            key={dept.id}
            value={dept.id}
        >
            {dept.departmentName}
        </option>
    ))}
</select>

                                    </div>

                                    {/* SALARY */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Salary
                                        </label>

                                        <input
                                            type="number"
                                            name="salary"
                                            className="form-control"
                                            value={form.salary}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >

                                        {saving
                                            ? 'Saving...'
                                            : editId !== null
                                                ? 'Update'
                                                : 'Submit'}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

            {/* ================================= */}
            {/* DELETE CONFIRMATION MODAL */}
            {/* ================================= */}

            {showDelete && selectedEmployee && (

                <div
                    className="modal show d-block"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header bg-danger text-white">

                                <h5 className="modal-title">
                                    Delete Confirmation
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowDelete(false)}
                                />

                            </div>

                            <div className="modal-body">

                                <p>
                                    Are you sure you want to delete this employee?
                                </p>

                                <p>
                                    <strong>Name:</strong>{' '}
                                    {selectedEmployee.firstName}{' '}
                                    {selectedEmployee.lastName}
                                </p>

                                <p>
                                    <strong>Department:</strong>{' '}
                                    {selectedEmployee.departmentName}
                                </p>

                                <p>
                                    <strong>Salary:</strong>{' '}
                                    {selectedEmployee.salary}
                                </p>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDelete(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default EmployeeAPI;
