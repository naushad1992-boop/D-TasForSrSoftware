using Microsoft.EntityFrameworkCore;
using EmployeeAPI.Data;
using EmployeeAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// Database connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Repository Dependency Injection

builder.Services.AddScoped<
    IDepartmentRepository,
    DepartmentRepository>();


builder.Services.AddScoped<
    IEmployeeRepository,
    EmployeeRepository>();

// React CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173",
                             "http://localhost:5175",
                             "http://localhost:5180",
                             "http://localhost:3000",
                             "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseCors("AllowReact");

app.UseCors("ReactPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();