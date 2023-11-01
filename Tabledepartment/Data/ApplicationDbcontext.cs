using Microsoft.EntityFrameworkCore;
using Tabledepartment.Models;

namespace Tabledepartment.Data
{
    public class ApplicationDbcontext:DbContext
    {
        public ApplicationDbcontext(DbContextOptions<ApplicationDbcontext> options) : base(options)
        {
        }
        public DbSet<Department> departments { get; set; }
        public DbSet<Students> students { get; set; }
    }
}
