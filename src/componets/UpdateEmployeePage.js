import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UpdateEmployeePage.css';

function UpdateEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userRole = parseInt(localStorage.getItem('userRole'), 10);
    const [showPassword, setShowPassword] = useState(false);

 const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [employeeData, setEmployeeData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        department: '',
        salary: '',
        role: 0,
    });

    const imageInputRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEmployeeData((prevData) => ({ ...prevData, image: file }));
    };

    const handleRoleChange = () => {
        setEmployeeData((prevData) => ({ ...prevData, role: prevData.role === 1 ? 0 : 1 }));
    };

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', employeeData.id);
        formData.append('first_name', employeeData.first_name);
        formData.append('last_name', employeeData.last_name);
        formData.append('email', employeeData.email);
        formData.append('password', employeeData.password);
        formData.append('userRole', userRole);

        if (employeeData.image) {
            formData.append('profile', employeeData.image);
        }

        if (userRole === 1) {
            formData.append('department', employeeData.department);
            formData.append('salary', employeeData.salary);
            formData.append('role', employeeData.role);
        }

        try {
            const response = await fetch(`http://localhost:3001/employees/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error updating employee');
            }

            const data = await response.json();
            console.log('Employee updated:', data);
            navigate('/dashboard');

            Swal.fire({
                icon: 'success',
                title: 'Employee Updated Successfully!',
                showConfirmButton: false,
                timer: 2500,
            });
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/employees/details?userRole=0&employeeId=${id}`);
            if (!response.ok) {
                throw new Error('Error fetching employee data');
            }
            const data = await response.json();

            setEmployeeData(data[0]);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    return (
        <div className="update-employee-container">
            <div className="form-container">
                <h2>Update Employee</h2>
                <form onSubmit={handleUpdateEmployee}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={employeeData.first_name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={employeeData.last_name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={employeeData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={employeeData.password}
                            onChange={handleInputChange}
                        />
                        <span
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </label>
                    <label>
                        Profile Image:
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                        />
                    </label>
                    {userRole === 1 && (
                        <>
                            <label>
                                Department:
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="Department"
                                    value={employeeData.department}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Salary:
                                <input
                                    type="text"
                                    name="salary"
                                    placeholder="Salary"
                                    value={employeeData.salary}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <div className="checkbox-container">
                                <label className="checkbox-label">Role:</label>
                                <input
                                    type="checkbox"
                                    name="role"
                                    checked={employeeData.role === 1}
                                    onChange={handleRoleChange}
                                />
                            </div>
                        </>
                    )}
                    <button type="submit">Update Employee</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateEmployeePage;
