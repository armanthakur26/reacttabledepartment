using System.ComponentModel.DataAnnotations.Schema;

namespace Tabledepartment.Models
{
    public class Students
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int age { get; set; }
        public int Departmentid { get; set; }
        [ForeignKey("Departmentid")]
        public Department? department { get; set; }

    }
}
