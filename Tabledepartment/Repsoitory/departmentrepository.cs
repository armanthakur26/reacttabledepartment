using Tabledepartment.Data;
using Tabledepartment.Models;
using Tabledepartment.Repsoitory.IRepository;

namespace Tabledepartment.Repsoitory
{
    public class departmentrepository : Idepartment
    {
        private readonly ApplicationDbcontext _context;
        public departmentrepository(ApplicationDbcontext context)
        {
            _context= context;
        }
       
        public bool createdepartment(Department department)
        {
          _context.departments.Add(department);
            return save();
        }

        public bool deletedepartment(int id)
        {
            var del = _context.departments.Find(id);
            _context.departments.Remove(del);
            return save();
        }

        public Department Getdepartment(int id)
        {
            return _context.departments.Find(id);
        }

        public ICollection<Department> Getdepartments()
        {
            return _context.departments.ToList();
        }

            public bool save()
        {
            return _context.SaveChanges() == 1 ? true : false;
        }

        public bool Updatedepartment(Department updatedDepartment)
        {
            var existingDepartment = _context.departments.Find(updatedDepartment.Id);
            existingDepartment.Name = updatedDepartment.Name;
            if (updatedDepartment.Image != null)
            {
                existingDepartment.Image = updatedDepartment.Image;
            }
            return save();
        }

        public bool deleteMultipleDepartments(List<int> departmentIds)
        {
            var departmentsToDelete = _context.departments.Where(d => departmentIds.Contains(d.Id)).ToList();
            _context.departments.RemoveRange(departmentsToDelete);
            return save();
        }
        public bool updateMultipleDepartments(List<Department> updatedDepartments)
        {
            foreach (var updatedDepartment in updatedDepartments)
            {
                var existingDepartment = _context.departments.Find(updatedDepartment.Id);
                if (existingDepartment != null)
                {
                    existingDepartment.Name = updatedDepartment.Name;
                    if (updatedDepartment.Image != null)
                    {
                        existingDepartment.Image = updatedDepartment.Image;
                    }
                }
            }
            return save();
        }



    }
}
