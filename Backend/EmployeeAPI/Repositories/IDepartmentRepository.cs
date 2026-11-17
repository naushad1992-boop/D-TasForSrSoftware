
using EmployeeAPI.Models;

namespace EmployeeAPI.Repositories
{
    public interface IDepartmentRepository
    {
        Task<List<DepartmentMaster>> ListDepartmentsAsync();

        Task<DepartmentMaster?> GetDepartmentByIdAsync(int id);

        Task AddDepartmentAsync(DepartmentMaster department);

        Task UpdateDepartmentAsync(DepartmentMaster department);

        Task <bool>DeleteDepartmentAsync(int id);

        //  Task<bool> DeleteAsync(int id);
    }
}
