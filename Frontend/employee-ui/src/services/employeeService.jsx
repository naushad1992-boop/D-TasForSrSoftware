
import axios from 'axios';

const API_URL = 'http://localhost:5190/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

console.log('Employee API Response:', API_URL);

// Get employees with Search, Sorting and Pagination
export const getEmployees = async (
    search = '',
    sortColumn = 'id',
    sortOrder = 'asc',
    pageNumber = 1,
    pageSize = 5
) => {
    try {
        const response = await api.get('/employee', {
            params: {
                search,
                sortColumn,
                sortOrder,
                pageNumber,
                pageSize
            }
        });
console.log('Employee API Response:', response.data);
        return response;
        
        
    } catch (error) {
        console.error('Employee API Error:', error.response?.data || error.message);
        throw error;
    }
};

// Get all departments
export const getDepartments = async () => {
    debugger;
    try {
        const response = await api.get('/Department');
         console.log('Department API Response:', response.data);
        return response;
    } catch (error) {
        console.error('Department API Error:', error.response?.data || error.message);
        throw error;
    }
   
};

// Add employee
export const addEmployee = async (employee) => {
    return await api.post('/employee', employee);
};

// Update employee
export const updateEmployee = async (id, employee) => {
    return await api.put(`/employee/${id}`, employee);
};

// Delete employee
export const deleteEmployee = async (id) => {
    return await api.delete(`/employee/${id}`);
};
