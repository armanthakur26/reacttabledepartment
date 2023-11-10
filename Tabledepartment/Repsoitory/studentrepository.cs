using Microsoft.EntityFrameworkCore;
using Tabledepartment.Data;
using Tabledepartment.Models;
using Tabledepartment.Repsoitory.IRepository;

namespace Tabledepartment.Repsoitory
{
    public class studentrepository : Istudents
    {

        private readonly ApplicationDbcontext _context;
        public studentrepository(ApplicationDbcontext context) 
        {
            _context = context; 
        }
        public bool createstudent(Students students)
        {
            _context.students.Add(students);
            return save();
        }

        public bool deletestudent(int id)
        {
           var del=_context.students.Find(id); 
           _context.students.Remove(del);
            return save();
        }

        public ICollection<Students> GetStudents()
        {
            return  _context.students.Include(t => t.department).ToList();
        }

        public Students GetStudents(int id)
        {
            throw new NotImplementedException();
        }

        public bool save()
        {
            return _context.SaveChanges() == 1 ? true : false;
        }


        public bool updatestudent(Students students)
        {
            if (students.Departmentid == 0)
            {
                var existingStudent = _context.students.FirstOrDefault(s => s.Id == students.Id);
                if (existingStudent != null)
                {
                    existingStudent.Name = students.Name;
                    existingStudent.age = students.age;
                    students.Departmentid = existingStudent.Departmentid;
                    _context.students.Update(existingStudent);
                }
            }
            else
            {
                _context.students.Update(students);
            }      
            return save();
        }

        public ICollection<Students> GetStudentsByDepartment(int departmentId)
        {
            return _context.students
                .Where(s => s.department.Id == departmentId).Include(s => s.department)
                .ToList();
        }

        public bool deletemultistudent(List<int> studentsid)
        {
            var studentdelete = _context.students.Where(d => studentsid.Contains(d.Id)).ToList();
            _context.students.RemoveRange(studentdelete);
            return save();
        }

    }
}
