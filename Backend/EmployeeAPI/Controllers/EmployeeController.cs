using Microsoft.AspNetCore.Mvc;
using EmployeeAPI.DTOs;
using EmployeeAPI.Models;
using EmployeeAPI.Repositories;

namespace EmployeeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeController(IEmployeeRepository repository)
        {
            _repository = repository;
        }



        // GET: api/Employee
        // Search, Sorting and Pagination

        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? search = null,
            string? sortColumn = "id",
            string? sortOrder = "asc",
            int pageNumber = 1,
            int pageSize = 10)
        {
            // Get employees from repository
            var employees = await _repository.GetAllAsync();

            // 1. SEARCH
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();

                employees = employees.Where(e =>
                    e.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    e.LastName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    (e.Department?.DepartmentName ?? "")
                        .Contains(search, StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            // 2. SORTING
            var isDescending = sortOrder?.ToLower() == "desc";

            employees = sortColumn?.ToLower() switch
            {
                "name" => (isDescending
                    ? employees.OrderByDescending(e => e.FirstName)
                        .ThenByDescending(e => e.LastName)
                    : employees.OrderBy(e => e.FirstName)
                        .ThenBy(e => e.LastName)).ToList(),

                "salary" => (isDescending
                    ? employees.OrderByDescending(e => e.Salary)
                    : employees.OrderBy(e => e.Salary)).ToList(),

                _ => (isDescending
                    ? employees.OrderByDescending(e => e.Id)
                    : employees.OrderBy(e => e.Id)).ToList()
            };

            // 3. TOTAL RECORDS
            var totalRecords = employees.Count();

            // 4. PAGINATION
            pageNumber = Math.Max(1, pageNumber);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = employees
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Salary = e.Salary,
                    DepartmentId = e.DepartmentId,
                    DepartmentName = e.Department?.DepartmentName ?? ""
                })
                .ToList();

            // 5. RETURN RESPONSE
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









        // GET: api/Employee
        // [HttpGet]
        // public async Task<IActionResult> GetAll()
        // {
        //     var employees = await _repository.GetAllAsync();

        //     var result = employees.Select(e => new EmployeeDto
        //     {
        //         Id = e.Id,
        //         FirstName = e.FirstName,
        //         LastName = e.LastName,
        //         Salary = e.Salary,
        //         DepartmentId = e.DepartmentId,
        //         DepartmentName = e.Department?.DepartmentName ?? ""
        //     });

        //     return Ok(result);
        // }

        // GET: api/Employee/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _repository.GetByIdAsync(id);

            if (employee == null)
                return NotFound();

            return Ok(new EmployeeDto
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Salary = employee.Salary,
                DepartmentId = employee.DepartmentId,
                DepartmentName = employee.Department?.DepartmentName ?? ""
            });
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<IActionResult> Create(EmployeeCreateDto dto)
        {
            var departments = await _repository.GetDepartmentsAsync();

            if (!departments.Any(d => d.Id == dto.DepartmentId))
                return BadRequest("Invalid department.");

            var employee = new EmployeeTest
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Salary = dto.Salary,
                DepartmentId = dto.DepartmentId
            };

            var result = await _repository.AddAsync(employee);

            return Ok(new
            {
                message = "Employee added successfully",
                id = result.Id
            });
        }

        // PUT: api/Employee/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id, EmployeeCreateDto dto)
        {
            var departments = await _repository.GetDepartmentsAsync();

            if (!departments.Any(d => d.Id == dto.DepartmentId))
                return BadRequest("Invalid department.");

            var employee = new EmployeeTest
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Salary = dto.Salary,
                DepartmentId = dto.DepartmentId
            };

            var result = await _repository.UpdateAsync(id, employee);

            if (!result)
                return NotFound();

            return Ok("Employee updated successfully");
        }

        // DELETE: api/Employee/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repository.DeleteAsync(id);

            if (!result)
                return NotFound();

            return Ok("Employee deleted successfully");
        }
    }
}