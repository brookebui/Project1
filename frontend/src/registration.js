import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './signupvalidation'
import axios from 'axios'

function Registration(){
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        salary: '',
        age: '',
        username: '',
        password: ''
    })
    const navigate = useNavigate()

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        
        if(err.firstname === "" && err.lastname === "" && err.salary === "" && err.age === "" && err.username === "" && err.password === "") {
            axios.post('http://localhost:5050/signup', values)
            .then(response => {
                if(response.data.success) {
                    navigate('/')
                } else {
                    alert("Error creating account");
                }
            })
            .catch(err => {
                console.error(err);
                alert("Error creating account");
            })
        }
    }
    return(
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#98C1D9' }}>
            <div className ='bg-white p-3 rounded w-25'>
                <h2>Sign Up</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type ="username" placeholder="Enter Username" name = 'username' onChange={handleInput} className='form-control rounded-0'/>
                        {errors.username && <span className = 'text-danger'> {errors.username}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="firstName"><strong>First Name</strong></label>
                        <input type ="firstName" placeholder="Enter First Name" name = 'firstname' onChange={handleInput} className='form-control rounded-0'/>
                        {errors.firstname && <span className = 'text-danger'> {errors.firstname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <input type ="lastName" placeholder="Enter Last Name" name = 'lastname' onChange={handleInput} className='form-control rounded-0'/>
                        {errors.lastname && <span className = 'text-danger'> {errors.lastname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="salary"><strong>Salary</strong></label>
                        <input type ="salary" placeholder="Enter Salary" name = 'salary' onChange={handleInput} className='form-control rounded-0'/>
                        {errors.salary && <span className = 'text-danger'> {errors.salary}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="age"><strong>Age</strong></label>
                        <input type ="age" placeholder="Enter Age" name = 'age' onChange={handleInput} className='form-control rounded-0'/>
                        {errors.age && <span className = 'text-danger'> {errors.age}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type ="password" placeholder="Enter Password" name = 'password' onChange={handleInput}className='form-control rounded-0'/>
                        {errors.password && <span className = 'text-danger'> {errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Sign up</button>
                    <p></p>
                    <Link to="/home" className='btn btn-light border w-100 rounded-0'>Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Registration
