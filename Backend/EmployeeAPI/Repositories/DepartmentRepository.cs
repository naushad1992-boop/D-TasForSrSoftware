
using EmployeeAPI.Data;
using EmployeeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly ApplicationDbContext _context;

        public DepartmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DepartmentMaster>> ListDepartmentsAsync()
        {
            return await _context.DepartmentMasters
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<DepartmentMaster?> GetDepartmentByIdAsync(int id)
        {
            return await _context.DepartmentMasters
                .FindAsync(id);
        }

        public async Task AddDepartmentAsync(DepartmentMaster department)
        {
             _context.DepartmentMasters.Add(department);
            await _context.SaveChangesAsync();
             return;
        }

        public async Task UpdateDepartmentAsync(DepartmentMaster department)
        {
            _context.DepartmentMasters.Update(department);
            await _context.SaveChangesAsync();
        }

        public async Task <bool>DeleteDepartmentAsync(int id)
        {
            var department = await _context.DepartmentMasters.FindAsync(id);

            if (department == null)
            {
                return false;
            }

            _context.DepartmentMasters.Remove(department);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
