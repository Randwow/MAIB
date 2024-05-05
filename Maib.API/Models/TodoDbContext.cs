using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
    {
    }

    public DbSet<Task> Tasks { get; set; }
}
