import React, { Component } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Students: [],
    };
  }

  componentDidMount() {
    this.getStudents();
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
            <button type="button" className="btn btn-primary" onClick={() => this.editData(e.id)}>
              <i className="fas fa-edit"></i>
            </button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => this.deleteData(e.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </>
        ),
      },
    ];

    return (
      <div>
        <h2>Students</h2>
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
          </div>}
          expandableRows
          expandableRowExpanded={() => false}
          expandableRowsComponent={this.expandData}
        />
      </div>
    );
  }
}

export default Student;
