import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './componets/LoginPage';
import DashboardPage from './componets/DashboardPage';
import AddEmployeePage from './componets/AddEmployeePage';
import UpdateEmployeePage from './componets/UpdateEmployeePage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/add-employee" element={<AddEmployeePage />} />
                <Route path="/update-employee/:id" element={<UpdateEmployeePage />} />
            </Routes>
        </Router>
    );
}

export default App;
