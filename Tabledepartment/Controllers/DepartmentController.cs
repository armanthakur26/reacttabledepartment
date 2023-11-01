using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tabledepartment.Models;
using Tabledepartment.Repsoitory.IRepository;

namespace Tabledepartment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly Idepartment _department;
        public DepartmentController(Idepartment department)
        {
            _department = department;
        }
        [HttpGet]
        public IActionResult getdepartmet()
        {
            var dep = _department.Getdepartments();
            return  Ok(dep);

        }
        [HttpPost] 
        public IActionResult Createdepartment([FromBody]Department department) 
        {
            var add = _department.createdepartment(department);
            return Ok(department);
        }
        [HttpDelete]
        public IActionResult deletedepartment(int id)
        {
            var del=_department.deletedepartment(id);
            return Ok(del);
        }
        [HttpPut]
        public IActionResult editdepartment([FromBody]Department department)
        {
            var edit=_department.Updatedepartment(department);
            return Ok(edit);
        }
       
    }
}
