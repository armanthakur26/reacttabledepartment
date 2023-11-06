using Tabledepartment.Models;

namespace Tabledepartment.Repsoitory.IRepository
{
    public interface Istudents
    {
        ICollection<Students> GetStudents();
        bool createstudent(Students students);
        bool updatestudent(Students students);
        bool deletestudent(int id);

       Students GetStudents(int id);
        ICollection<Students> GetStudentsByDepartment(int departmentId);
        bool deletemultistudent(List<int> studentsid);
      

        bool save();
    }
}
