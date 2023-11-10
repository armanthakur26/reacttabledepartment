 import axios from 'axios';
import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom';
import {  CSVLink } from "react-csv";
import { jsPDF } from 'jspdf';

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Department: [],
          Students:[],
          newdepartment: {
            name: "",
            image: null, },
            isadd:false,
            isedit: false,
            editdepartment: { 
              name: "",
              image:null
            },
            isdelete:false, 
            selectall:[],
            iseditmultiple:false,
            expandedStudentData: [],
            search: '',
            filter: [], 
        };
      }
      componentDidMount() {
        this.getdepartments();
        this.expandDepartment();
      }
      handleSearchChange = (e) => {
        const search = e.target.value;
        const result = this.state.Department.filter((e) => {
            return e.name.toLowerCase().includes(search.toLowerCase());
        });
        this.setState({ search, filter: result });
    }
      getdepartments=()=>{
        axios
          .get("https://localhost:7038/api/Department")
          .then((response) => { this.setState({ Department: response.data,filter:response.data}); })
          .catch((error) => {
            console.log(error);
          });
      }
      adddata=()=>{
        this.setState({
            isadd: true,
            newdepartment: {
              name: "",
              image: null, },
          });
      }
      addInput = (e) => {
        const { name, value } = e.target;
        const {newdepartment}=this.state
        this.setState({
          newdepartment: { ...newdepartment, [name]: value },
        });
      };
      
       handleAddImageChange = (event) => {
        const{newdepartment}=this.state
        const imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState(({
            newdepartment: { ...newdepartment, image: reader.result },
          }));
        };
        if (imageFile) {
          reader.readAsDataURL(imageFile);
        }
      };
      handleSubmit = async (e) => {
        e.preventDefault(); 
        const { name,  image } = this.state.newdepartment;
        const{Department,filter}=this.state
        if (name.length === 0) {
          alert("Please Enter Name");
          return;
        }
        if (!image) {
          alert("Please Select Image");
          return;
        }
        try {
          const response = await axios.post("https://localhost:7038/api/Department", {
            name,
            image,
          });
          this.setState(({
            Department: [...Department, response.data],
            filter: [...filter, response.data],
            isadd: false,
          }));
        } catch (error) {
          console.error("something wrong to add shipment:", error);
        }
      };
      editData = (id) => {
        const department = this.state.Department.find((department) => department.id === id);
        if (department) {
          this.setState({
            isedit: true,
            editdepartment: { ...department },
          });
        }
      };
      editInput = (e) => {
        const { name, value } = e.target;
        const{editdepartment}=this.state
        this.setState({
          editdepartment: { ...editdepartment, [name]: value },
        });
      };
      EditSubmitbutton = async (e) => {
        e.preventDefault();
        const { id, name, image } = this.state.editdepartment;
        if (name.length === 0) {
          alert("Please Enter Name");
          return;
        }
        try {
          await axios.put(`https://localhost:7038/api/Department?id=${id}`, {
            id,
            name,
            image,
          });
          this.setState({
            filter: this.state.filter.map(department =>{
              if (department.id === id) {
              return {...department, name,image };
            } else {
              return department;
            }}
            ),
            isedit: false,
          });          
          console.log("Department edited successfully");
        } catch (error) {
          console.error("Error editing department:", error);
        }
      };
      handleeditimagechange = (event) => {
        const {editdepartment}=this.state
        const imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState({
            editdepartment: { ...editdepartment, image: reader.result },
          });
        };
        if (imageFile) {
          reader.readAsDataURL(imageFile);
        }
      };
      isdeletemodel=()=>{
        this.setState({isdelete:true})
      }
      Deletedata = async (Id) => {
        try {
          await axios.delete(`https://localhost:7038/api/Department?id=${Id}`);
          this.setState({
            Department: this.state.Department.filter((department) => department.id !== Id),
            filter: this.state.filter.filter((department) => department.id !== Id),
          });
          console.log("Department deleted successfully");
        } catch (error) {
          console.error("Error deleting department:", error);
        }
      }; 
      handlealldelete=async() =>{
        const {selectall}=this.state;
        axios.delete("https://localhost:7038/api/Department/multiple",{
          data:selectall,
        })
        .then((responce)=>{
          console.log("department delete successfully");
          window.location.reload();
        }).catch((error)=>{
          console.error("error delete items",error);
        });
      } 
      editDatamultiple = () => {
        const { selectall, Department } = this.state;
        if (selectall.length === 1) {
          const selectedDepartment = Department.find((department) => department.id === selectall[0]);
          if (selectedDepartment) {
            this.setState({ editdepartment: { ...selectedDepartment }, });
          }
        } else {
          this.setState({
            editdepartment: {
              name: "",
              image: null,
            },
          });
        }
        this.setState({ iseditmultiple: true });
      };
      editmultiple = async () => {
        const { selectall, editdepartment } = this.state;
        try {
          const requestData = selectall.map(id => ({
            id,
            name: editdepartment.name,
            image: editdepartment.image,
          }));
          const response = await axios.put('https://localhost:7038/api/Department/multiple', requestData);
          this.setState({
            Department: response.data,
            filter:response.data,
            iseditmultiple: false,
          });
          window.location.reload();
          console.log('Departments edited successfully');
        } catch (error) {
          console.error('Error editing departments:', error);
        }
      };
        expandDepartment = async (id) => {
          const {expandedStudentData}=this.state
          try {
            const response = await axios.get(
              `https://localhost:7038/api/Students/department/${id}`
            );
            this.setState({
              expandedStudentData: { ...expandedStudentData,[id]: response.data, },
            });
          } catch (error) {
            console.error('Error fetching related students:', error);
          }
        };
        generatePDF = async () => {
          const { Department } = this.state;
          const pdf = new jsPDF();
          let space = 10;
          Department.forEach((department) => {
            const img = new Image();
            img.src = department.image;
            pdf.text(`Department Name: ${department.name}`, 10, space);
            pdf.addImage(department.image, 'JPEG', 10, space+10 , 50, 50);
            space += 70;
          });
          pdf.save('departments.pdf');
        };
        expenddata = (row) => {
         const expandedData = this.state.expandedStudentData[row.data.id] || [];
          const studentscolumns = [
          {
            name: "Student Name",
            selector: (e) => e.name,
            sortable: true,
          },
          {
            name: "Student Age",
            selector: (e) => e.age,
            sortable: true,
          },{
            name: "Student Department",
            selector: (e) => e.department.name,
            sortable: true,
          },]
          return (
            <div>
           <DataTable 
           columns={studentscolumns}
           data={expandedData}
           pagination 
           highlightOnHover
           fixedHeader
            />
            </div>
          );
        };
  render() { 
    const csvData = this.state.Department.map((department) => ({
      Name: department.name,
      Image:department.image
    }));
    const columns = [
        {
          name: "Brach Name",
          selector: (e) => e.name,
          sortable: true,
        },
        {
          name: "image",
          selector: (e) => <img height={70} width={70} src={e.image} alt="image" />,
        },  {
          name: "Actions",
          selector: (e) => (
            <>
              <button  type="button" class="btn btn-primary"  title="Edit"data-toggle="modal" data-target="#editDepartmentModal" className="btn btn-danger" onClick={() => this.editData(e.id)}>
              <i className="fas fa-edit"></i>
              </button>
              &nbsp;
              <button className="btn btn-danger"  title="Delete" onClick={() => this.Deletedata(e.id)}> <i className="fas fa-trash"></i> </button>
            </>
          ),
        },]
    return (
      <div  style={{height:"50%",width:"50%", marginLeft:"20%"}}>
   <h2>Department Details</h2>
   {this.state.iseditmultiple && (
<div class="modal fade" id="editmultiple" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div >
              <label>Name:</label>
              <input
                type="text"
                name="name"
                 value={this.state.editdepartment.name}
                onChange={this.editInput}
              />
            </div>
            <br />
            <div style={{marginLeft:"18%"}}>
               <label>Image:</label>
               <input
                  type="file"
                  name="image"
                 onChange={this.handleeditimagechange}/>
              </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.editmultiple}>Save changes</button>
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
   
   <Link to="/Students"><button type="button" class="btn btn-primary"style={{marginRight:'90%'}}  >Go to Students portal</button></Link>
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addDepartmentModal" style={{marginLeft:'80%'}} onClick={this.adddata}>Add Department</button>
{this.state.isadd && (
  <div class="modal fade" id="addDepartmentModal" tabindex="-1" role="dialog" aria-labelledby="addDepartmentModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addDepartmentModalLabel">Add Department</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={this.state.newdepartment.name} onChange={this.addInput} />
          </div>
          <br />
          <div style={{ marginLeft: "18%" }}>
            <label>Image:</label>
            <input type="file" name="image" onChange={this.handleAddImageChange} />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Save</button>
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
          <h5 class="modal-title" id="editDepartmentModalLabel">Edit Department</h5>
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
              value={this.state.editdepartment.name}
              onChange={this.editInput}
            />
          </div>
          <br />
          <div style={{ marginLeft: "18%" }}>
            <label>Image:</label>
            <input
              type="file"
              name="image"
              onChange={this.handleeditimagechange}
            />
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
   <DataTable 
    columns={columns}
    data={this.state.filter}
    pagination
    selectableRows
    onSelectedRowsChange={( {selectedRows} ) => {const selectall = selectedRows.map((row) => row.id);this.setState( {selectall});}}
     highlightOnHover
    fixedHeader
    defaultSortFieldId={1}
     actions   
   contextActions={<div>
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editmultiple" onClick={this.editDatamultiple} > <i className="fas fa-edit"></i></button>&nbsp;
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#Deleteallmodel" onClick={this.isdeletemodel}><i className="fas fa-trash"></i></button>&nbsp;
  </div>}
  expandableRows
  expandableRowsComponent={this.expenddata}
 onRowMouseEnter={(row)=> this.expandDepartment(row.id)}
 subHeader
 subHeaderComponent={
   <div>
     <input type="text" placeholder="Search..." value={this.state.search}onChange={this.handleSearchChange}/>&nbsp;
   <button><CSVLink filename="my-file.csv"  title="Download Excel"data={csvData}><i className="fa-regular fa-file-excel" style={{ color: 'green' }}></i></CSVLink></button>&nbsp;
   <button  title="Download Pdf" type="button"  onClick={this.generatePDF}  style={{ color: 'red' }}>
   <i class="fas fa-file-pdf"></i>
</button>
 </div>
 }
/>
</div>
    )
  }
}
export default  Department 
