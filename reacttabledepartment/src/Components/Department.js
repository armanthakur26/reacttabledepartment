 import axios from 'axios';
import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom';
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
            
        };
      }
      componentDidMount() {
        this.getdepartments();
        this.expandDepartment();
      }
      getdepartments=()=>{
        axios
          .get("https://localhost:7038/api/Department")
          .then((response) => { this.setState({ Department: response.data}); })
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
       this.setState((prevdata) => ({
         newdepartment: { ...prevdata.newdepartment, [name]: value },
        }));
      };
       handleAddImageChange = (event) => {
        const imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState((prevState) => ({
            newdepartment: { ...prevState.newdepartment, image: reader.result },
          }));
        };
        if (imageFile) {
          reader.readAsDataURL(imageFile);
        }
      };
      handleSubmit = async (e) => {
        e.preventDefault(); 
        const { name,  image } = this.state.newdepartment;
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
          this.setState((prevState) => ({
            Department: [...prevState.Department, response.data],
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
        this.setState((prevdata) => ({
          editdepartment: { ...prevdata.editdepartment, [name]: value },
        }));
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
          this.setState((prevState) => ({
            Department: prevState.Department.map((department) => {
              if (department.id === id) {
                return {...department, name,image };
              } else {
                return department;
              }
            }),
            isedit: false,
          }));
        } catch (error) {
          console.error("Error editing shipment:", error);
        }
      };
      handleeditimagechange = (event) => {
        const imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState((prevState) => ({
            editdepartment: { ...prevState.editdepartment, image: reader.result },
          }));
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
          this.setState((prevState) => ({
            Department: prevState.Department.filter((department) => department.id !== Id),
          }));
        } catch (error) {
          console.error("Error deleting shipment:", error);
        }
      };
      handlealldelete=async() =>{
        const {selectall}=this.state;
        try{
          for(const id of selectall)
          {
            await axios.delete(`https://localhost:7038/api/Department?id=${id}`)
            this.setState((prevState) => ({
              Department: prevState.Department.filter((department) => !selectall.includes(department.id)),
              isdelete:false,
            }));
          }  
        }catch (error) {
          console.error("Error deleting shipment:", error);
        }
      }  
      editDatamultiple = () => {
        this.setState({ iseditmultiple: true, });};
      editmultiple = async (e) => {
          e.preventDefault();
          const { selectall } = this.state;
          const { id,name,image} = this.state.editdepartment; 
          try {
            for (const ids of selectall) {
              await axios.put(`https://localhost:7038/api/Department?id=${ids}`, {
                id:ids,
                name,
                image,
              });
              this.setState((prevState) => ({
                Department: [...prevState.Department],
                iseditmultiple: false,
              }));
              this.getdepartments();
            }
          } catch (error) {
            console.error("Error editing shipment:", error);
          }
        };
      
        expandDepartment = async (id) => {
          try {
            const response = await axios.get(
              `https://localhost:7038/api/Students/department/${id}`
            );
            this.setState((e) => ({
              expandedStudentData: { ...e.expandedStudentData,[id]: response.data, },
            }));
          } catch (error) {
            console.error('Error fetching related students:', error);
          }
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
              <button  type="button" class="btn btn-primary" data-toggle="modal" data-target="#editDepartmentModal" className="btn btn-danger" onClick={() => this.editData(e.id)}>
              <i className="fas fa-edit"></i>
              </button>
              &nbsp;
              <button className="btn btn-danger" onClick={() => this.Deletedata(e.id)}> <i className="fas fa-trash"></i> </button>
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
    data={this.state.Department}
    pagination
    selectableRows
    onSelectedRowsChange={( {selectedRows} ) => {const selectall = selectedRows.map((row) => row.id);this.setState( {selectall});}}
     highlightOnHover
    fixedHeader
    defaultSortFieldId={1}
     actions   
   contextActions={<div>
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editmultiple" onClick={this.editDatamultiple} > <i className="fas fa-edit"></i></button>&nbsp;
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#Deleteallmodel" onClick={this.isdeletemodel}><i className="fas fa-trash"></i></button>
  </div>}
  expandableRows
  expandableRowsComponent={this.expenddata}
 onRowMouseEnter={(row)=> this.expandDepartment(row.id)}
/>
      </div>
    )
  }
}
export default  Department 
