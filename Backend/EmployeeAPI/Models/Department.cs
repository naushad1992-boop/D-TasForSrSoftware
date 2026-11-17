using System.ComponentModel.DataAnnotations;

namespace EmployeeAPI.Models
{
    public class DepartmentMaster
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;

        public ICollection<EmployeeTest> Employees { get; set; }
            = new List<EmployeeTest>();
    }
}