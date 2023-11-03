import React, { Component } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

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
    };
  }
  componentDidMount() {
    this.getStudents();
    this.getDepartments(); 
  }

  getStudents = () => {
    axios
      .get("https://localhost:7038/api/Students")
      .then((response) => {
        this.setState({ Students: response.data });
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  adddata=()=>{
    this.setState({
        isadd: true,
        newstudent: {
          name: '',
          age: '',
          departmentId: '', 
        }});
  }
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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
    this.setState((prevState) => ({
      newstudent: {
        ...prevState.newstudent,
        [name]: value,
      },
    }));
  }

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
  DepartmentOptions() {
    return this.state.departments.map((department) => (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    ));
  }
  Deletedata = async (Id) => {
    try {
      await axios.delete(`https://localhost:7038/api/Students?id=${Id}`);
      this.setState((prevState) => ({
        Students: prevState.Students.filter((student) => student.id !== Id),
      }));
    } catch (error) {
      console.error("Error deleting shipment:", error);
    }
  };
  editData = (id) => {
    const students = this.state.Students.find((student) => student.id === id);
    if (students) {
      this.setState({
        isedit: true,
        editstudent: { ...students },
      });
    }
  };
  editInput = (e) => {
    const { name, value } = e.target;
    this.setState((prevdata) => ({
      editstudent: { ...prevdata.editstudent, [name]: value },
    }));
  };
  EditSubmitbutton = async (e) => {
    e.preventDefault();
    const { id, name, age,departmentid } = this.state.editstudent;
    try {
      await axios.put(`https://localhost:7038/api/Students?id=${id}`, {
        id,
        name,
        age,
        departmentid
      });
      this.setState((prevState) => ({
        Students: prevState.Students.map((student) => {
          if (student.id === id) {
            return {...student, name,age,departmentid };
          } else {
            return student;
          }
        }),
        isedit: false,
      }));
    } catch (error) {
      console.error("Error editing shipment:", error);
    }
  };
  isdeletemodel=()=>{
    this.setState({isdelete:true})
  }
  handlealldelete=async() =>{
    const {selectall}=this.state;
    try{
      for(const id of selectall)
      {
        await axios.delete(`https://localhost:7038/api/Students?id=${id}`)
        this.setState((prevState) => ({
          Students: prevState.Students.filter((student) => !selectall.includes(student.id)),
          isdelete:false,
          selectall:[],
        }));
      }  
    }catch (error) {
      console.error("Error deleting shipment:", error);
    }
  }  
  render() {
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
              <button  type="button" class="btn btn-primary" data-toggle="modal" data-target="#editDepartmentModal" className="btn btn-danger" onClick={() => this.editData(e.id)}>
              <i className="fas fa-edit"></i>
              </button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => this.Deletedata(e.id)}> <i className="fas fa-trash"></i> </button>
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
              {this.DepartmentOptions()}
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
              {this.DepartmentOptions()}
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
          data={this.state.Students}
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
          contextActions={<div>
           <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#Deleteallmodel" onClick={this.isdeletemodel}><i className="fas fa-trash"></i></button>
          </div>}
        />
      </div>
    );
  }
}

export default Student;