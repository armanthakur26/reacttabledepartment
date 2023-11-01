using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tabledepartment.Models;
using Tabledepartment.Repsoitory.IRepository;

namespace Tabledepartment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly Istudents _students;

        public StudentsController(Istudents students) 
        {
            _students = students;
        }
        [HttpGet]
        public IActionResult getemployees() 
        {
        var student=_students.GetStudents();
            return Ok(student);
        }
        [HttpPost]
        public IActionResult createstudent([FromBody]Students students)
        {
            var student = _students.createstudent(students);
            return Ok(student);
        }
        [HttpDelete]
        public IActionResult deletestudent(int id)
        {
            var student = _students.deletestudent(id);
            return Ok(student);
        }
        [HttpPut]
        public IActionResult updatestudent(Students students)
        {
            var student = _students.updatestudent(students);
            return Ok(student);
        }
    }
}
