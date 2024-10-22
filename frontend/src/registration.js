import React from 'react'
import { Link } from 'react-router-dom'

function Registration(){
    return(
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#98C1D9' }}>
            <div className ='bg-white p-3 rounded w-25'>
                <h2>Sign Up</h2>
                <form action="">
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type ="username" placeholder="Enter Username" className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="firstName"><strong>First Name</strong></label>
                        <input type ="firstName" placeholder="Enter First Name" className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <input type ="lastName" placeholder="Enter Last Name" className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="salary"><strong>Salary</strong></label>
                        <input type ="salary" placeholder="Enter Salary" className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="age"><strong>Age</strong></label>
                        <input type ="age" placeholder="Enter Age" className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type ="password" placeholder="Enter Password" className='form-control rounded-0'/>
                    </div>
                    <button className='btn btn-success w-100 rounded-0'>Sign up</button>
                    <p></p>
                    <Link to="/home" className='btn btn-light border w-100 rounded-0'>Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Registration
