using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Maib.API.Models;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly TodoDbContext _context;
    private readonly ILogger<TasksController> _logger;

    public TasksController(TodoDbContext context, ILogger<TasksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/tasks
    [HttpGet]
    public async Task<IActionResult> GetTasks(string status = null, string sortBy = null)
    {
        _logger.LogInformation("GetTasks method called with parameters: status={Status}, sortBy={SortBy}", status, sortBy);

        IQueryable<Maib.API.Models.Task> query = _context.Tasks;

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status.ToLower() == status.ToLower());
        }

        if (!string.IsNullOrEmpty(sortBy))
        {
            switch (sortBy.ToLower())
            {
                case "priority":
                    query = query.OrderBy(t => t.Priority);
                    break;
                case "createdon":
                    query = query.OrderBy(t => t.CreatedOn);
                    break;
                case "modifiedon":
                    query = query.OrderBy(t => t.ModifiedOn);
                    break;
                default:
                    _logger.LogWarning("Invalid sortBy parameter: {SortBy}", sortBy);
                    return BadRequest("Invalid sortBy parameter");
            }
        }

        var tasks = await query.ToListAsync();

        _logger.LogInformation("Returning {Count} tasks", tasks.Count);

        return Ok(tasks);
    }

    // GET: api/tasks/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Maib.API.Models.Task>> GetTask(int id)
    {
        _logger.LogInformation("GetTask method called with id={Id}", id);

        var task = await _context.Tasks.FindAsync(id);

        if (task == null)
        {
            _logger.LogInformation("Task with id={Id} not found", id);
            return NotFound();
        }

        return task;
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<Maib.API.Models.Task>> AddTask(Maib.API.Models.Task task)
    {
        _logger.LogInformation("AddTask method called");

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task added with id={Id}", task.Id);

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    // PUT: api/tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, Maib.API.Models.Task task)
    {
        _logger.LogInformation("UpdateTask method called with id={Id}", id);

        if (id != task.Id)
        {
            _logger.LogWarning("Id mismatch in UpdateTask method: id={Id}, task.Id={TaskId}", id, task.Id);
            return BadRequest();
        }

        _context.Entry(task).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Task updated successfully with id={Id}", id);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TaskExists(id))
            {
                _logger.LogInformation("Task with id={Id} not found", id);
                return NotFound();
            }
            else
            {
                _logger.LogError("Error updating task with id={Id}", id);
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        _logger.LogInformation("DeleteTask method called with id={Id}", id);

        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            _logger.LogInformation("Task with id={Id} not found", id);
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task deleted successfully with id={Id}", id);

        return NoContent();
    }

    private bool TaskExists(int id)
    {
        return _context.Tasks.Any(e => e.Id == id);
    }
}
