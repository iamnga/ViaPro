using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ViaPro.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ViaInfo",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UID = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    PrivateCode = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    PassEmail = table.Column<string>(nullable: true),
                    Country = table.Column<string>(nullable: true),
                    CreatedYear = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Cookie = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true),
                    Price = table.Column<int>(nullable: false),
                    SaleUser = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaInfo", x => x.ID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ViaInfo");
        }
    }
}
