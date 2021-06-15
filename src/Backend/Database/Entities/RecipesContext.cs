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
        public DbSet<Tag> Tags { get; set; }
        public DbSet<RecipeTag> RecipeTags { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            if (!options.IsConfigured)
            {
                options.UseSqlServer("Server=(local);Database=Perry;Trusted_Connection=True;");
                options.EnableSensitiveDataLogging();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>().ToTable("Recipe");
            modelBuilder.Entity<Tag>().ToTable("Tag");
            modelBuilder.Entity<RecipeTag>().ToTable("RecipeTag");

            modelBuilder.Entity<RecipeTag>()
                .HasKey(rt => new { rt.RecipeId, rt.TagId });

            modelBuilder.Entity<RecipeTag>()
                .HasOne(rt => rt.Recipe)
                .WithMany(r => r.RecipeTags)
                .HasForeignKey(rt => rt.RecipeId);

            modelBuilder.Entity<RecipeTag>()
                .HasOne(rt => rt.Tag)
                .WithMany(t => t.RecipeTags)
                .HasForeignKey(rt => rt.TagId);
        }
    }
}
