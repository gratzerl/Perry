using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Perry.Database.Migrations
{
    public partial class SplitIngredientsAndSteps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                sql: "DROP FULLTEXT INDEX ON Recipe;",
                suppressTransaction: true
            );

            migrationBuilder.DropColumn(
                name: "Ingredients",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "Method",
                table: "Recipe");

            migrationBuilder.CreateTable(
                name: "Ingredient",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    RecipeId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ingredient_Recipe_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MethodStep",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Number = table.Column<int>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    RecipeId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MethodStep", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MethodStep_Recipe_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_RecipeId",
                table: "Ingredient",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_MethodStep_RecipeId",
                table: "MethodStep",
                column: "RecipeId");

            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Ingredient(Text) KEY INDEX PK_Ingredient;",
                suppressTransaction: true
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Recipe(Ingredients) KEY INDEX PK_Recipe;",
                suppressTransaction: true
            );

            migrationBuilder.Sql(
                sql: "DROP FULLTEXT INDEX ON Ingredient;",
                suppressTransaction: true
            );

            migrationBuilder.DropTable(
                name: "Ingredient");

            migrationBuilder.DropTable(
                name: "MethodStep");

            migrationBuilder.AddColumn<string>(
                name: "Ingredients",
                table: "Recipe",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Method",
                table: "Recipe",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
