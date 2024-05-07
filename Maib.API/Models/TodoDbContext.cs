using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
namespace Maib.API.Models
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {
        }

        public DbSet<Task> Tasks { get; set; }
    }
}