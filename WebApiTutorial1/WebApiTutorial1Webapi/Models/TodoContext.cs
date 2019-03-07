using Microsoft.EntityFrameworkCore;

namespace WebApiTutorial1Webapi.Models
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
