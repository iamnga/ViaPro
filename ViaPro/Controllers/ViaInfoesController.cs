using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimeZoneConverter;
using ViaManagement.Model;
using ViaPro.Data;

namespace ViaPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViaInfoesController : ControllerBase
    {
        private readonly ViaProContext _context;
        TimeZoneInfo tzi = TZConvert.GetTimeZoneInfo("Asia/Ho_Chi_Minh");
        public ViaInfoesController(ViaProContext context)
        {
            _context = context;
        }


        // GET: api/ViaInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ViaInfo>>> GetViaInfo()
        {
            return await _context.ViaInfo.OrderByDescending(x => x.UpdatedDate).ToListAsync();
        }

        // GET: api/ViaInfoes/5
        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<ViaInfo>>> SearchVia(ViaSearch data)
        {
            data.FromDate = TimeZoneInfo.ConvertTime(data.FromDate, tzi);
            data.ToDate = TimeZoneInfo.ConvertTime(data.ToDate, tzi);
            var viaInfo = await _context.ViaInfo.
                Where(x => (x.Country == data.Country || data.Country == string.Empty)
                && (x.Type == data.Type || data.Type == string.Empty)
                && (x.Status == data.Status || data.Status == -1)
                && (
                    (x.UpdatedDate.Date >= data.FromDate.Date && x.UpdatedDate.Date <= data.ToDate.Date)
                    || (data.FromDate.ToString() == null && data.ToDate.ToString() == null)
                   )
                ).ToListAsync();

            if (viaInfo == null)
            {
                return NotFound();
            }

            return viaInfo;
        }

        // PUT: api/ViaInfoes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutViaInfo(int id, ViaInfo viaInfo)
        {
            if (id != viaInfo.ID)
            {
                return BadRequest();
            }
            viaInfo.CreatedDate = TimeZoneInfo.ConvertTime(viaInfo.CreatedDate, tzi);
            viaInfo.UpdatedDate = TimeZoneInfo.ConvertTime(viaInfo.UpdatedDate, tzi);
            _context.Entry(viaInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ViaInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ViaInfoes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ViaInfo>> PostViaInfo(ViaInfo viaInfo)
        {
            viaInfo.CreatedDate = TimeZoneInfo.ConvertTime(viaInfo.CreatedDate, tzi);
            viaInfo.UpdatedDate = TimeZoneInfo.ConvertTime(viaInfo.UpdatedDate, tzi);
            _context.ViaInfo.Add(viaInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetViaInfo", new { id = viaInfo.ID }, viaInfo);
        }

        // DELETE: api/ViaInfoes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ViaInfo>> DeleteViaInfo(int id)
        {
            var viaInfo = await _context.ViaInfo.FindAsync(id);
            if (viaInfo == null)
            {
                return NotFound();
            }

            _context.ViaInfo.Remove(viaInfo);
            await _context.SaveChangesAsync();

            return viaInfo;
        }

        private bool ViaInfoExists(int id)
        {
            return _context.ViaInfo.Any(e => e.ID == id);
        }
    }
}
