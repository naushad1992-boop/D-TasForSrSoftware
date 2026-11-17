
using Microsoft.AspNetCore.Mvc;
using EmployeeAPI.DTOs;
using EmployeeAPI.Models;
using EmployeeAPI.Repositories;

namespace EmployeeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _repository;

        public DepartmentController(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Department
        // Search, Sorting and Pagination
        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? search = null,
            string? sortColumn = "id",
            string? sortOrder = "asc",
            int pageNumber = 1,
            int pageSize = 10)
        {
            var departments = await _repository.ListDepartmentsAsync();

            // SEARCH
            if (!string.IsNullOrWhiteSpace(search))
            {
                departments = departments
                    .Where(d => d.DepartmentName != null &&
                        d.DepartmentName.Contains(
                            search.Trim(),
                            StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            // SORTING
            bool descending = sortOrder?.ToLower() == "desc";

            departments = sortColumn?.ToLower() switch
            {
                "name" or "departmentname" =>
                    descending
                    ? departments.OrderByDescending(d => d.DepartmentName).ToList()
                    : departments.OrderBy(d => d.DepartmentName).ToList(),

                _ =>
                    descending
                    ? departments.OrderByDescending(d => d.Id).ToList()
                    : departments.OrderBy(d => d.Id).ToList()
            };

            // TOTAL RECORDS
            int totalRecords = departments.Count;

            // PAGINATION
            pageNumber = Math.Max(1, pageNumber);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = departments
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    DepartmentName = d.DepartmentName
                })
                .ToList();

            return Ok(new
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(
                    (double)totalRecords / pageSize),
                Data = result
            });
        }

        // GET: api/Department/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var department =
                await _repository.GetDepartmentByIdAsync(id);

            if (department == null)
                return NotFound("Department not found.");

            return Ok(new DepartmentDto
            {
                Id = department.Id,
                DepartmentName = department.DepartmentName
            });
        }

        // POST: api/Department
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] DepartmentCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DepartmentName))
                return BadRequest("Department name is required.");

            var department = new DepartmentMaster
            {
                DepartmentName = dto.DepartmentName.Trim()
            };

            await _repository.AddDepartmentAsync(department);

            return Ok(new
            {
                Message = "Department added successfully.",
                Id = department.Id
            });
        }

        // PUT: api/Department/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] DepartmentCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DepartmentName))
                return BadRequest("Department name is required.");

            var department =
                await _repository.GetDepartmentByIdAsync(id);

            if (department == null)
                return NotFound("Department not found.");

            department.DepartmentName = dto.DepartmentName.Trim();

            await _repository.UpdateDepartmentAsync(department);

            return Ok("Department updated successfully.");
        }

        // DELETE: api/Department/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var department =
                await _repository.GetDepartmentByIdAsync(id);

            if (department == null)
                return NotFound("Department not found.");

            await _repository.DeleteDepartmentAsync(id);

            return Ok("Department deleted successfully.");
        }
    }
}
