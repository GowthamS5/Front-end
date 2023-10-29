import React from 'react';
import './LoginPage.css';
import './DashboardPage.css';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.status === 200 && responseData.success) {
        localStorage.setItem('userRole', responseData.role);
        localStorage.setItem('employee_id', responseData.employee_id);
        localStorage.setItem('jwtToken', responseData.token);

        console.log('JWT Token:', responseData.token);

        const sessionData = {
          role: responseData.role,
          employeeId: responseData.employee_id,
          token: responseData.token,
        };

        localStorage.setItem('sessionData', JSON.stringify(sessionData));

        if (responseData.role === 0 || responseData.role === 1) {
          window.location.href = '/dashboard';
        }

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Incorrect email or password. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing your request.',
      });
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
