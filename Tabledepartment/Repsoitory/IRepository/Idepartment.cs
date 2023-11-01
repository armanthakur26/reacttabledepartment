using Tabledepartment.Models;

namespace Tabledepartment.Repsoitory.IRepository
{
    public interface Idepartment
    {
        ICollection<Department> Getdepartments();
        Department Getdepartment(int id);
        bool createdepartment(Department department);
        bool Updatedepartment(Department department);
        bool deletedepartment(int id);
        bool save();
    }
}
