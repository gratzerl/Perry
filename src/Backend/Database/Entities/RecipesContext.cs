using Microsoft.EntityFrameworkCore;

namespace Perry.Database.Entities
{
    public class RecipesContext : DbContext
    {
        public RecipesContext()
        {
        }

        public RecipesContext(DbContextOptions<RecipesContext> options) : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            if (!options.IsConfigured)
            {
                // TODO replace this either with a value from a config file or remove it all together
                options.UseSqlServer("Server=DESKTOP-R73IC77;Database=Perry;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>().ToTable("Recipe");
            modelBuilder.Entity<Ingredient>().ToTable("Ingredient");
            modelBuilder.Entity<MethodStep>().ToTable("MethodStep");
        }
    }
}
