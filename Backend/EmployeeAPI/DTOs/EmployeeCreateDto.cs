using System.ComponentModel.DataAnnotations;

namespace EmployeeAPI.DTOs
{
    public class EmployeeCreateDto
    {
        [Required]
        public string FirstName { get; set; } = "";

        [Required]
        public string LastName { get; set; } = "";

        [Range(0, 999999999)]
        public decimal Salary { get; set; }

        [Range(1, int.MaxValue)]
        public int DepartmentId { get; set; }
    }
}