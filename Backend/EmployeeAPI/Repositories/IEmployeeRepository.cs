using EmployeeAPI.Models;

namespace EmployeeAPI.Repositories
{
    public interface IEmployeeRepository
    {
        Task<List<EmployeeTest>> GetAllAsync();

        Task<EmployeeTest?> GetByIdAsync(int id);

        Task<EmployeeTest> AddAsync(EmployeeTest employee);

        Task<bool> UpdateAsync(int id, EmployeeTest employee);

        Task<bool> DeleteAsync(int id);

        Task<List<DepartmentMaster>> GetDepartmentsAsync();
    }
}