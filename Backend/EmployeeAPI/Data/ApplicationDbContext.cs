
using Microsoft.EntityFrameworkCore;
using EmployeeAPI.Models;

namespace EmployeeAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<EmployeeTest> EmployeeTests { get; set; }

        public DbSet<DepartmentMaster> DepartmentMasters { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<EmployeeTest>(entity =>
            {
                entity.ToTable("EmployeeTest", "dbo");

                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Department)
                      .WithMany(d => d.Employees)
                      .HasForeignKey(e => e.DepartmentId);
            });

            modelBuilder.Entity<DepartmentMaster>(entity =>
            {
                entity.ToTable("DepartmentMaster", "dbo");

                entity.HasKey(d => d.Id);

                entity.Property(d => d.Id)
                      .HasColumnName("DepartmentId");
            });
        }
      
    }
}
