
import axios from 'axios';

const API_URL = 'http://localhost:5190/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// GET Departments with Search, Sorting and Pagination
export const getDepartments = async (
    search = '',
    sortColumn = 'id',
    sortOrder = 'asc',
    pageNumber = 1,
    pageSize = 5
) => {
    return await api.get('/Department', {
        params: {
            search,
            sortColumn,
            sortOrder,
            pageNumber,
            pageSize
        }
    });
};

// GET Department by ID
export const getDepartmentById = async (id) => {
    return await api.get(`/Department/${id}`);
};

// ADD Department
export const addDepartment = async (department) => {
    return await api.post('/Department', department);
};

// UPDATE Department
export const updateDepartment = async (id, department) => {
    return await api.put(`/Department/${id}`, department);
};

// DELETE Department
export const deleteDepartment = async (id) => {
    return await api.delete(`/Department/${id}`);
};
