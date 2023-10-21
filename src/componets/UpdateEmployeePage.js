import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function UpdateEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();

   const userRole = parseInt(localStorage.getItem('userRole'), 10);
   console.log('userRole:',userRole);

    const [employeeData, setEmployeeData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        department: '',
        salary: '',
        role: 0,
    });

    const [image, setImage] = useState(null);
    const imageInputRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleUpdateEmployee = () => {
        const formData = new FormData();
        formData.append('first_name', employeeData.first_name);
        formData.append('last_name', employeeData.last_name);
        formData.append('email', employeeData.email);
        formData.append('password', employeeData.password);
        formData.append('userRole', userRole);
       
  if (image) {
            formData.append('profile', image);
        }
     if (userRole === 1) {
            formData.append('department', employeeData.department);
            formData.append('salary', employeeData.salary);
            formData.append('role', employeeData.role);
             }

        fetch(`http://localhost:3001/employees/${id}`, {
            method: 'PUT',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error updating employee');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Employee updated:', data);
                navigate('/dashboard');

                Swal.fire({
                    icon: 'success',
                    title: 'Employee Updated Successfully!',
                    showConfirmButton: false,
                    timer: 2500,
                });
            })
            .catch((error) => {
                console.error('Error updating employee f:', error);
            });
    };

    return (
        <div>
            <h2>Update Employee</h2>
            <div>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={employeeData.first_name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={employeeData.last_name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={employeeData.email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={employeeData.password}
                    onChange={handleInputChange}
                />
          <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                        />
                {userRole === 1 && (
                    <>
                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={employeeData.department}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="salary"
                            placeholder="Salary"
                            value={employeeData.salary}
                            onChange={handleInputChange}
                        />
                        
                       <label>
                    Role:
                    <input
                        type="checkbox"
                        name="role"
                        checked={employeeData.role === 1}
                        onChange={() => {
                            setEmployeeData((prevData) => ({
                                ...prevData,
                                role: prevData.role === 1 ? 0 : 1,
                            }));
                        }}
                    />
                </label>
                    </>
                )}
                
                <button onClick={handleUpdateEmployee}>Update Employee</button>
            </div>
        </div>
    );
}

export default UpdateEmployeePage;
