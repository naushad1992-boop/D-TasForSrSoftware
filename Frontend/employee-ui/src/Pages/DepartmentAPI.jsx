import React, { useEffect, useState } from 'react';

import {
    getDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
} from '../services/departmentService';

import 'bootstrap/dist/css/bootstrap.min.css';

function DepartmentAPI() {

    // STATE
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');

    const [sortColumn, setSortColumn] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [editId, setEditId] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [departmentName, setDepartmentName] = useState('');

    // =====================================
    // GET DEPARTMENTS
    // =====================================

    const loadDepartments = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await getDepartments(
                search,
                sortColumn,
                sortOrder,
                pageNumber,
                pageSize
            );

            const result = response.data;

            const list = Array.isArray(result)
                ? result
                : (
                    result?.data ??
                    result?.items ??
                    result?.Data ??
                    result?.Items ??
                    []
                );

            setDepartments(Array.isArray(list) ? list : []);

            const records = Array.isArray(result)
                ? list.length
                : (
                    result?.totalRecords ??
                    result?.TotalRecords ??
                    list.length
                );

            setTotalRecords(records);

            setTotalPages(
                Array.isArray(result)
                    ? Math.ceil(records / pageSize)
                    : (
                        result?.totalPages ??
                        result?.TotalPages ??
                        Math.ceil(records / pageSize)
                    )
            );

        } catch (err) {

            console.error('Get Department Error:', err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                'Unable to load departments.'
            );

            setDepartments([]);

        } finally {

            setLoading(false);

        }
    };

    // =====================================
    // LOAD DATA
    // =====================================

    useEffect(() => {

        loadDepartments();

    }, [search, sortColumn, sortOrder, pageNumber, pageSize]);

    // =====================================
    // ADD DEPARTMENT
    // =====================================

    const handleAdd = () => {

        setEditId(null);
        setDepartmentName('');
        setShowModal(true);

    };

    // =====================================
    // EDIT DEPARTMENT
    // =====================================

    const handleEdit = (department) => {

        const id = department.id ?? department.Id;

        const name =
            department.departmentName ??
            department.DepartmentName ??
            '';

        setEditId(id);
        setDepartmentName(name);
        setShowModal(true);

    };

    // =====================================
    // SAVE / UPDATE DEPARTMENT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const trimmedName = departmentName.trim();
        const trimmedId = editId?.toString().trim();

        if (!trimmedName) {

            alert('Please enter department name.');
            return;

        }

        // Send only the fields expected by the Department API.
        const department = {
            departmentName: trimmedName
        };

        try {

            setSaving(true);

            if (editId !== null) {

                // UPDATE

                await updateDepartment(editId, department);

                alert('Department updated successfully!');

            } else {

                // ADD

                const response = await addDepartment(department);

                console.log('Department Added:', response.data);

                alert('Department added successfully!');

            }

            setShowModal(false);
            setDepartmentName('');
            setEditId(null);

            // RELOAD DATA

            if (pageNumber !== 1) {

                setPageNumber(1);

            } else {

                await loadDepartments();

            }

        } catch (err) {

            console.error('Department Save Error:', err);

            console.error('API Response:', err.response?.data);

            alert(
                err.response?.data?.message ||
                err.response?.data?.title ||
                (
                    typeof err.response?.data === 'string'
                        ? err.response.data
                        : err.message
                ) ||
                'Unable to save department.'
            );

        } finally {

            setSaving(false);

        }

    };

    // =====================================
    // CLOSE MODAL
    // =====================================

    const handleCloseModal = () => {

        if (saving) return;

        setShowModal(false);
        setDepartmentName('');
        setEditId(null);

    };

    // =====================================
    // DELETE CONFIRMATION
    // =====================================

    const handleDeleteClick = (department) => {

        setSelectedDepartment(department);
        setShowDelete(true);

    };

    // =====================================
    // DELETE DEPARTMENT
    // =====================================



    const handleDelete = async () => {

        if (!selectedDepartment) return;

        try {

            const departmentId = getDepartmentId(selectedDepartment);

            if (departmentId === undefined || departmentId === null) {
                throw new Error('Department ID was not found. Check the API response fields.');
            }

            await deleteDepartment(departmentId);

            setShowDelete(false);
            setSelectedDepartment(null);

            alert('Department Deleted Successfully');

            if (departments.length === 1 && pageNumber > 1) {

                setPageNumber(prev => prev - 1);

            }
            else {

                await loadDepartments();

            }

        }
        catch (error) {

            console.error(
                'Delete Department Error:',
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.title ||
                (typeof error.response?.data === 'string' ? error.response.data : error.message) ||
                'Delete operation failed'
            );

        }

    };





    // =====================================
    // SORTING
    // =====================================

    const handleSort = (column) => {

        if (sortColumn === column) {

            setSortOrder(
                sortOrder === 'asc' ? 'desc' : 'asc'
            );

        } else {

            setSortColumn(column);
            setSortOrder('asc');

        }

        setPageNumber(1);

    };

    // =====================================
    // PAGE SIZE
    // =====================================

    const handlePageSize = (e) => {

        setPageSize(Number(e.target.value));
        setPageNumber(1);

    };

    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = (e) => {

        setSearch(e.target.value);
        setPageNumber(1);

    };

    // =====================================
    // HELPERS
    // =====================================

    const getDepartmentName = (department) => {

        return (
            department.departmentName ??
            department.DepartmentName ??
            ''
        );

    };

    const getDepartmentId = (department) => {

        return (
            department.id ??
            department.Id
        );

    };

    // =====================================
    // UI
    // =====================================

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">
                        Department Management
                    </h4>

                </div>

                <div className="card-body">

                    {/* SEARCH AND ADD */}

                    <div className="row mb-3 align-items-center">

                        <div className="col-md-4 mb-2">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search department..."
                                value={search}
                                onChange={handleSearch}
                            />

                        </div>

                        <div className="col-md-3 mb-2">

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

                        <div className="col-md-2 mb-2">

                            <strong>Total: {totalRecords}</strong>

                        </div>

                        <div className="col-md-3 text-end mb-2">

                            <button
                                className="btn btn-success"
                                onClick={handleAdd}
                            >
                                + Add Department
                            </button>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}

                    {/* TABLE */}

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th
                                        onClick={() => handleSort('id')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        ID
                                        {sortColumn === 'id' &&
                                            (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </th>

                                    <th
                                        onClick={() => handleSort('name')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Department Name
                                        {sortColumn === 'name' &&
                                            (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            Loading...
                                        </td>
                                    </tr>

                                ) : departments.length > 0 ? (

                                    departments.map((department) => (

                                        <tr key={getDepartmentId(department)}>

                                            <td>
                                                {getDepartmentId(department)}
                                            </td>

                                            <td>
                                                {getDepartmentName(department)}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => handleEdit(department)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDeleteClick(department)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            No departments found.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINATION */}

                    <div className="d-flex justify-content-between align-items-center">

                        <span>
                            Total Records: {totalRecords}
                        </span>

                        <div>

                            <button
                                className="btn btn-outline-primary me-2"
                                disabled={pageNumber <= 1 || loading}
                                onClick={() => setPageNumber(prev => prev - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pageNumber} of {totalPages}
                            </span>

                            <button
                                className="btn btn-outline-primary ms-2"
                                disabled={
                                    pageNumber >= totalPages || loading
                                }
                                onClick={() => setPageNumber(prev => prev + 1)}
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <form onSubmit={handleSubmit}>

                                <div className="modal-header">

                                    <h5 className="modal-title">

                                        {editId !== null
                                            ? 'Edit Department'
                                            : 'Add Department'}

                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                        disabled={saving}
                                    />

                                </div>

                                <div className="modal-body">

                                    <label className="form-label">
                                        Department Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter department name"
                                        value={departmentName}
                                        onChange={(e) =>
                                            setDepartmentName(e.target.value)
                                        }
                                        required
                                        disabled={saving}
                                    />

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                        disabled={saving}
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={saving}
                                    >

                                        {saving
                                            ? 'Saving...'
                                            : editId !== null
                                                ? 'Update'
                                                : 'Save'
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

            {/* DELETE MODAL */}

            {showDelete && selectedDepartment && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title text-danger">
                                    Confirm Delete
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDelete(false)}
                                />

                            </div>

                            <div className="modal-body">

                                <p>
                                    Are you sure you want to delete this department?
                                </p>

                                <p>
                                    <strong>ID:</strong>{' '}
                                    {getDepartmentId(selectedDepartment)}
                                </p>

                                <p>
                                    <strong>Department:</strong>{' '}
                                    {getDepartmentName(selectedDepartment)}
                                </p>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDelete(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default DepartmentAPI;
