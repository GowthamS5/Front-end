import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 
  const userRole = parseInt(localStorage.getItem('userRole'), 10);
  const employeeId = localStorage.getItem('employee_id');
  
const sessionData = JSON.parse(localStorage.getItem('sessionData'));
 console.log('Session Data:', sessionData);
  //consloe.log(sessionData);
  console.log('userRole:',userRole);
  console.log('id is :', employeeId);
  const accessToken = localStorage.getItem('accessToken');

const checkToken = () =>{ 
const accessToken = localStorage.getItem('jwtToken');
if (!accessToken) {

 navigate('/');
      return;
    }

    const decodedToken = jwt_decode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      
      navigate('/');
      return;
    }
    
  }


  
useEffect(() => {
  checkToken();  
  const url = `http://localhost:3001/employees/details?userRole=${userRole}&employeeId=${employeeId}`;

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      return response.json();
    })
    .then((data) => {
  console.log('Response data:', data);
  setEmployeeDetails(data);
})

    .catch((error) => {
      console.error('Error getting employee details:', error);
    });
},[employeeId, userRole, accessToken]);

  const clickUpdateEmployee = (employeeId) => {
 
    navigate(`/update-employee/${employeeId}`);
  };

  const clickAddEmployee = () => {
 
    navigate('/add-employee');
  };

  const clickDeleteEmployee = (employeeId) => {
   
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this employee!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true,
      })
        .then((result) => {
        if (result.isConfirmed) {
          setEmployeeToDelete(employeeId);
          confirmDelete();
    }})
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      fetch(`http://localhost:3001/employees/${employeeToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error deleting employee');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Employee deleted:', data);
          Swal.fire('Employee Deleted', 'Employee deleted successfully.', 'success');
          setShowDeleteConfirmation(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error deleting employee:', error);
          Swal.fire('Error', 'An error occurred while deleting the employee.', 'error');
        });
    }
  };

  return (
    <div className="dashboard-container">
      <h1>WELCOME</h1>
 
      <h2>Employees List</h2>
     {userRole === 1 && (
       <button className="add-employee" onClick={clickAddEmployee}>add employees</button>
      )}
      <ul className="employee-list">
        {employeeDetails.map((employee) => {
          const dob = new Date(employee.DOB);
          const formattedDOB = format(dob, 'dd/MM/yyyy');

          return (
            <li key={employee.id} className="employee-item">
              <div className="employee-image">
                <img
                  src={employee.image}
                  alt={`Profile of ${employee.first_name} ${employee.last_name}`}
                />
              </div>
              <div className="employee-info">
                <p className="employee-name">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="employee-department">Department: {employee.department}</p>
                <p className="employee-salary">Salary: {employee.salary}</p>
                <p className="employee-dob">DOB: {formattedDOB}</p>
              </div>
              {userRole === 1 && (
                <div className="employee-buttons">
                  <button
                    className="update-button"
                    onClick={() => clickUpdateEmployee(employee.id)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => clickDeleteEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              {userRole === 0 && (
                <div className="employee-buttons">
                  <button
                    className="update-button"
                    onClick={() => clickUpdateEmployee(employee.id)}
                  >
                    Update
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DashboardPage;
