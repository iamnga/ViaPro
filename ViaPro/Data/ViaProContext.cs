using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ViaManagement.Model;

namespace ViaPro.Data
{
    public class ViaProContext : DbContext
    {
        public ViaProContext (DbContextOptions<ViaProContext> options)
            : base(options)
        {
        }

        public DbSet<ViaManagement.Model.ViaInfo> ViaInfo { get; set; }
    }
}
