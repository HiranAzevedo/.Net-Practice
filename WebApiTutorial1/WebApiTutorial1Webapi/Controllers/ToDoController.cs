using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApiTutorial1Webapi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApiTutorial1Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly TodoContext _context;


        public ToDoController(TodoContext context)
        {
            _context = context;

            if (_context.TodoItems.Any())
            {
                return;
            }

            // Create a new TodoItem if collection is empty,
            // which means you can't delete all TodoItems.
            _context.TodoItems.Add(new TodoItem { Name = "Item1" });
            _context.SaveChanges();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetAllItems()
        {
            return await _context.TodoItems.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetItemById(long id)
        {
            var todo = await _context.TodoItems.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            return todo;
        }

        [HttpPost]
        public async Task<ActionResult<TodoItem>> SaveToDoItem(TodoItem item)
        {
            await _context.TodoItems.AddAsync(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItemById), routeValues: new { id = item.Id }, value: item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutToDoItem(long id, TodoItem item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDoItem(long id)
        {
            var todo = await _context.TodoItems.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
