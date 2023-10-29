import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './styles.css';

function AddEmployeePage() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!data.first_name || !data.last_name || !data.department || !data.salary || !data.DOB || !data.profile || !data.email || !data.password) {
      alert('All fields (first_name, last_name, department, salary, DOB, profile image, email, and password) are required.');
      return;
    }

    const formattedDOB = new Date(data.DOB).toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('department', data.department);
    formData.append('salary', data.salary);
    formData.append('DOB', formattedDOB);
    formData.append('profile', data.profile[0]);
    formData.append('email', data.email);
    formData.append('password', data.password);

    formData.append('role', data.role ? '1' : '0');

    try {
      const response = await fetch('http://localhost:3001/employees/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Employee added:', responseData);
        navigate('/dashboard');

        Swal.fire({
          icon: 'success',
          title: 'Employee Added Successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const errorData = await response.json();
        if (errorData.message === 'An employee with the same Date of Birth already exists.') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Employee with the same Date of Birth already exists. Please enter a different Date of Birth.',
          });
        } else {
          throw new Error(errorData.message);
        }
      }
    } catch (error) {
      console.error('Error adding an employee:', error);
    }
  }

  return (
    <div className="update-employee-container">
      <div className="form-container">
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            First Name:
            <Controller
              name="first_name"
              control={control}
              defaultValue=""
              rules={{
                required: 'First Name is required.',
                minLength: {
                  value: 3,
                  message: 'First Name should be at least 3 characters.',
                },
                maxLength: {
                  value: 25,
                  message: 'First Name should not exceed 25 characters.',
                },
              }}
              render={({ field }) => <input {...field} />}
            />
          </label>
          {errors.first_name && <p className="error">{errors.first_name.message}</p>}
          <br />
          <label>
            Last Name:
            <Controller
              name="last_name"
              control={control}
              defaultValue=""
              rules={{
                required: 'Last Name is required.',
                minLength: {
                  value: 1,
                  message: 'Last Name should be at least 1 character.',
                },
                maxLength: {
                  value: 25,
                  message: 'Last Name should not exceed 25 characters.',
                },
              }}
              render={({ field }) => <input {...field} />}
            />
          </label>
          {errors.last_name && <p className="error">{errors.last_name.message}</p>}
          <br />
          <label>
            Department:
            <Controller
              name="department"
              control={control}
              defaultValue=""
              rules={{ required: 'Department is required.' }}
              render={({ field }) => <input {...field} />}
            />
          </label>
          {errors.department && <p className="error">{errors.department.message}</p>}
          <br />
          <label>
            Salary:
            <Controller
              name="salary"
              control={control}
              defaultValue=""
              rules={{ required: 'Salary is required.' }}
              render={({ field }) => <input {...field} />}
            />
          </label>
          {errors.salary && <p className="error">{errors.salary.message}</p>}
          <br />
          <label>
            Date of Birth:
            <Controller
              name="DOB"
              control={control}
              defaultValue=""
              rules={{ required: 'Date of Birth is required.' }}
              render={({ field }) => <input type="date" {...field} />}
            />
          </label>
          {errors.DOB && <p className="error">{errors.DOB.message}</p>}
          <br />
          <label>
            Profile Image:
            <Controller
              name="profile"
              control={control}
              defaultValue={null}
              rules={{ required: 'Profile Image is required.' }}
              render={({ field }) => <input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />}
            />
          </label>
          {errors.profile && <p className="error">{errors.profile.message}</p>}
          <br />
          <label>
            Email:
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email format',
                },
              }}
              render={({ field }) => <input {...field} />}
            />
          </label>
          {errors.email && <p className="error">{errors.email.message}</p>}
          <br />
          <label>
            Password:
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'Password is required.',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters.',
                },
              }}
              render={({ field }) => <input type="password" {...field} />}
            />
          </label>
          {errors.password && <p className="error">{errors.password.message}</p>}
          <br />
          <div className="checkbox-container">
            <label>
              <Controller
                name="role"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <div>
                    <input type="checkbox" {...field} />
                    Make an Admin
                  </div>
                )}
              />
            </label>
          </div>
          <br />
          <button type="submit">Add Employee</button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeePage;
