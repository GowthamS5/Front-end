  import React from 'react';
import './LoginPage.css';
import './DashboardPage.css';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';

function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          localStorage.setItem('userRole', responseData.role);
          localStorage.setItem('employee_id', responseData.employee_id);
          localStorage.setItem('jwtToken', responseData.token);

          console.log('JWT Token:', responseData.token);

          // you may set in local storage at once as an object 
          //  obj = {role : responseData.role,
          //            employeeId : responseData.employee_id,
          //           token : responseData.token}
          // localStorage.setItem('sessionData',response)

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
          // login failed same has to be done here 
          // Swal.fire({
          //   icon: 'fail',
          //   title: 'Login Failed please try again with the correct credentials',
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
          console.error('Login failed:', responseData.message);
        }
      } else {
        console.error('Server error:', response.status);
      }
    } catch (error) {
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
            {/* you may do without using controller here */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              }}
              render={({ field }) => (
                <input
                  type="email"
                  placeholder="Enter email"
                  {...field}
                />
              )}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <label>Password:</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              )}
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
