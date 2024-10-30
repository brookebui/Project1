import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Validation from'./loginvalidation'

function Login(){
    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev=>({...prev,[event.target.name]:[event.target.value]}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
    }
    return(
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#98C1D9' }}>
            <div className ='bg-white p-3 rounded w-25'>
                <h2>Login</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type ="username" placeholder="Enter Username" name='username'onChange={handleInput} className='form-control rounded-0'/>
                        {errors.username && <span className = 'text-danger'> {errors.username}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type ="password" placeholder="Enter Password" name='password'onChange={handleInput} className='form-control rounded-0'/>
                        {errors.password && <span className = 'text-danger'> {errors.password}</span>}
                    </div>
                    <button type='submit'className='btn btn-success w-100 rounded-0'>Log in</button>
                    <p></p>
                    <Link to="/create-account" className='btn btn-light border w-100 rounded-0'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login
