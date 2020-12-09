using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ViaManagement.Model
{
    public class ViaInfo
    {
        public int ID { get; set; }
        public string UID { get; set; }
        public string Password { get; set; }
        public string PrivateCode { get; set; }
        public string Email { get; set; }
        public string PassEmail { get; set; }
        public string Country { get; set; }
        public string CreatedYear { get; set; }
        public string Type { get; set; }
        public int Status { get; set; }
        public string Cookie { get; set; }
        public string Note { get; set; }
        public int Price { get; set; }
        public string SaleUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class ViaSearch
    {
        public string Country { get; set; }
        public string Type { get; set; }
        public int Status { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}
