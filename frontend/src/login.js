import React from 'react'
import { Link } from 'react-router-dom'

function Login(){
    return(
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#98C1D9' }}>
            <div className ='bg-white p-3 rounded w-25'>
                <h2>Login</h2>
                <form action="">
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type ="username" placeholder="Enter Username" className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type ="password" placeholder="Enter Password" className='form-control rounded-0'/>
                    </div>
                    <button className='btn btn-success w-100 rounded-0'>Log in</button>
                    <p></p>
                    <Link to="/create-account" className='btn btn-light border w-100 rounded-0'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login
