import React, { Component } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import {  CSVLink } from "react-csv";
import { jsPDF } from 'jspdf'


class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Students: [],
      newstudent: {
        name: '',
        age: '',
        departmentId: '', 
      },
      departments: [],
      isadd:false,
      isedit: false,
      isdelete:false,
      editstudent: { 
        name: '',
        age: '',
        departmentId: '',
      },
      selectall:[],
       search: '',
      filter: [],
    };
  }
  componentDidMount() {
    this.getStudents();
    this.getDepartments(); 
  }
  handleSearchChange = (e) => {
    const search = e.target.value;
    const result = this.state.Students.filter((e) => {
        return e.name.toLowerCase().includes(search.toLowerCase()) || e.department.name.toLowerCase().includes(search.toLowerCase());
    });
    this.setState({ search, filter: result });
}  
  getStudents = () => {
    axios.get("https://localhost:7038/api/Students")
      .then((response) => {
        this.setState({ Students: response.data ,filter:response.data});
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  generatePDF = async () => {
    const { Students } = this.state;
    const pdf = new jsPDF();
    let space = 10;
    Students.forEach((student) => {
      pdf.text(`Name: ${student.name}`,10, space);
      pdf.text(`Age: ${student.age}`, 10, space + 10);
      pdf.text(`Department: ${student.department.name}`, 10, space + 20);
      space += 30;
    });
    pdf.save('students.pdf');
  };
  generateSelectedPDF = async () => {
    const { Students, selectall } = this.state;
    const selectedStudents = Students.filter((student) =>selectall.includes(student.id) );
    const pdf = new jsPDF();
    let space = 10;
    selectedStudents.forEach((student) => {
      pdf.text(`Name: ${student.name}`, 10, space);
      pdf.text(`Age: ${student.age}`, 10, space + 10);
      pdf.text(`Department: ${student.department.name}`, 10, space + 20);
      space += 30;
    });
    pdf.save('selected_students.pdf');
  };
  adddata=()=>{
    this.setState({
        isadd: true,
        newstudent: {
          name: '',
          age: '',
          departmentId: '', 
        }});
  }
  getDepartments = async () => {
    try {
      const response = await axios.get("https://localhost:7038/api/Department");
      this.setState({ departments: response.data });
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  handleInputChange = (e) => {
    const { name, value } = e.target;
const {newstudent}=this.state
    this.setState({
      newstudent: { ...newstudent,[name]: value, },
    });
  };
  createStudent = async () => {
    const { newstudent } = this.state;
    if (newstudent.name.length==0) {
      alert("Please enter a valid name.");
      return;
    }
    if (newstudent.age.length==0) {
      alert("Please enter a valid age.");
      return;
    }
    if (!newstudent.departmentId) {
      alert("Please select a department.");
      return;
    }
    try {
      const response = await axios.post("https://localhost:7038/api/Students", newstudent);
      console.log('Student created:', response.data);
      this.getStudents(); 
    } catch (error) {
      console.error('Error creating student:', error);
    }
  }
  Deletedata = async (Id) => {
    try {
      await axios.delete(`https://localhost:7038/api/Students?id=${Id}`);
      this.setState({
        Students: this.state.Students.filter((student) => student.id !== Id),
        filter: this.state.filter.filter((student) => student.id !== Id),
      });
      console.log("student deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  editData = (id) => {
    const students = this.state.filter.find((student) => student.id === id);
    if (students) {
      this.setState({
        isedit: true,
        editstudent: { ...students },
      });
    }
  };
  editInput = (e) => {
    const { name, value } = e.target;
    const {editstudent}=this.state;
    this.setState(({
      editstudent: { ...editstudent, [name]: value },
    }));
  };  
  EditSubmitbutton = async (e) => {
    e.preventDefault();
    const { id, name, age, departmentId } = this.state.editstudent;
    try {
      await axios.put(`https://localhost:7038/api/Students?id=${id}`, {
        id,
        name,
        age,
        departmentId,
      });
      this.setState({
        filter: this.state.filter.map((student) =>{
          if (student.id === id) {
            return {...student, name,age,departmentId };
          } else {
            return student;
          }
    }),isedit: false
  })
    } catch (error) {
      console.error("Error editing shipment:", error);
    }
  };
  isdeletemodel=()=>{
    this.setState({isdelete:true})
  }
  handlealldelete=async() =>{
    const {selectall}=this.state;
    axios.delete("https://localhost:7038/api/Students/multiple",{
      data:selectall,
      
    })
    .then((responce)=>{
      console.log("delete successfully");
      window.location.reload();
    }).catch((error)=>{
      console.error("error delete items",error);
    });
  }  
  render() {
    const csvData = this.state.Students.map((student) => ({
      Name: student.name,
      Age: student.age,
      Department: student.department.name, 
    }));
    const columns = [
      {
        name: "Name",
        selector: (e) => e.name,
        sortable: true,
      },
      {
        name: "Age",
        selector: (e) => e.age,
        sortable: true,
      },
      {
        name: "Department",
        selector: (e) => e.department.name,
        sortable: true,
      },
      {
        name: "Actions",
        selector: (e) => (
          <>
              <button  type="button" class="btn btn-primary"  title="Edit" data-toggle="modal" data-target="#editDepartmentModal" className="btn btn-danger" onClick={()=> this.editData(e.id)}>
              <i className="fas fa-edit"></i>
              </button> &nbsp;
            <button className="btn btn-danger"  title="Delete" onClick={() => this.Deletedata(e.id)}> <i className="fas fa-trash"></i> </button>
          </>
        ),
      },
    ];
    return (
      <div  style={{height:"50%",width:"50%", marginLeft:"20%"}}>
        <h2>Students Detail</h2>
        <Link to="/Department"><button type="button" class="btn btn-primary"style={{marginRight:'85%'}}  >Go To Department portal</button></Link>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addDepartmentModal" style={{marginLeft:'80%'}} onClick={this.adddata}>Add Student</button>
        {this.state.isadd && (
  <div class="modal fade" id="addDepartmentModal" tabindex="-1" role="dialog" aria-labelledby="addDepartmentModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addDepartmentModalLabel">Add Student</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={this.state.newstudent.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={this.state.newstudent.age}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Department:</label>
            <select
              name="departmentId"
              value={this.state.newstudent.departmentId}
              onChange={this.handleInputChange}
            >
              <option value="">Select Department</option>
        {this.state.departments.map((department) => ( <option key={department.id} value={department.id}>{department.name}</option>
    ))}
  </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal"onClick={this.createStudent}>Save</button>
        </div>
      </div>
    </div>
  </div>
)}
{this.state.isedit && (
  <div class="modal fade" id="editDepartmentModal" tabindex="-1" role="dialog" aria-labelledby="editDepartmentModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editDepartmentModalLabel">Edit student</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={this.state.editstudent.name}
              onChange={this.editInput}
            />
          </div>
          <br />
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={this.state.editstudent.age}
              onChange={this.editInput}
            />
          </div>
          <div>
            <label>Department:</label>
            <select
              name="departmentId"
              value={this.state.editstudent.departmentId}
              onChange={this.editInput}
            >
              <option value="">Select Department</option>
        {this.state.departments.map((department) => ( <option key={department.id} value={department.id}>{department.name}</option>
    ))} 
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.EditSubmitbutton}>Save changes</button>
        </div>
      </div>
    </div>
  </div>
)}
{this.state.isdelete &&
<div class="modal fade" id="Deleteallmodel" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
      <h5>Are you sure want to Delete Data</h5>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.handlealldelete}>Delete Data</button>
      </div>
    </div>
  </div></div>}
        <DataTable
          columns={columns}
          data={this.state.filter}
          pagination
          selectableRows
          onSelectedRowsChange={({ selectedRows }) => {
            const selectall = selectedRows.map((row) => row.id);
            this.setState({ selectall });
          }}
          highlightOnHover
          fixedHeader
          defaultSortFieldId={1}
          actions
          subHeader
          subHeaderComponent={
            <div>
               <input  type="text"  placeholder="Search..."   value={this.state.search}  onChange={this.handleSearchChange} />&nbsp;
           <button><CSVLink filename="my-file.csv"  title="Download Excel" data={csvData}><i className="fa-regular fa-file-excel" style={{ color: 'green'}}></i></CSVLink></button>&nbsp;
           <button type="button"  title="Download Pdf" onClick={this.generatePDF}  style={{ color: 'red' }}> <i class="fas fa-file-pdf"></i></button>
           <button>png format</button>
          </div>
          }
          contextActions={<div>
           <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#Deleteallmodel" title='Delete' onClick={this.isdeletemodel}><i className="fas fa-trash"></i></button>&nbsp;
           <button  class="btn btn-primary" onClick={this.generateSelectedPDF}  title="click here to Download Selected list Pdf"  style={{ color: 'red' }}><i class="fas fa-file-pdf"></i></button>
          </div>}
        />                                                                                                                                                                                                                                 
      </div>
    );
  }
}
export default Student;