using EmployeeAPI.Data;
using EmployeeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;

        public EmployeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmployeeTest>> GetAllAsync()
        {
            return await _context.EmployeeTests
                .Include(e => e.Department)
                .AsNoTracking()
                .ToListAsync();
            
        }

        public async Task<EmployeeTest?> GetByIdAsync(int id)
        {
            return await _context.EmployeeTests
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<EmployeeTest> AddAsync(EmployeeTest employee)
        {
            _context.EmployeeTests.Add(employee);

            await _context.SaveChangesAsync();

            return employee;
        }

        public async Task<bool> UpdateAsync(
            int id, EmployeeTest employee)
        {
            var existing = await _context.EmployeeTests.FindAsync(id);

            if (existing == null)
                return false;

            existing.FirstName = employee.FirstName;
            existing.LastName = employee.LastName;
            existing.Salary = employee.Salary;
            existing.DepartmentId = employee.DepartmentId;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _context.EmployeeTests.FindAsync(id);

            if (employee == null)
                return false;

            _context.EmployeeTests.Remove(employee);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<DepartmentMaster>> GetDepartmentsAsync()
        {
            return await _context.DepartmentMasters
                .AsNoTracking()
                .ToListAsync();
        }
    }
}