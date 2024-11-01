import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [updateData, setUpdateData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        salary: '',
        age: ''
    });
    const [showUpdateSection, setShowUpdateSection] = useState(false);
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [referenceUser, setReferenceUser] = useState('');
    const [showNeverSignedIn, setShowNeverSignedIn] = useState(false);
    const [sameRegisterDayUser, setSameRegisterDayUser] = useState('');

    // Fetch all data when component mounts
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = () => {
        axios.get('http://localhost:5050/getAll')
            .then(response => {
                console.log('Received data:', response.data);
                setUsers(response.data.data || []);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    };

    const handleSearch = () => {
        axios.get(`http://localhost:5050/search/${searchValue}`)
            .then(response => {
                setUsers(response.data.data || []);
                setSearchValue('');
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (username) => {
        axios.delete(`http://localhost:5050/delete/${username}`)
            .then(response => {
                if (response.data.success) {
                    fetchAllData();
                }
            })
            .catch(err => console.log(err));
    };

    const showEditInterface = (user) => {
        setUpdateData({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            salary: user.salary,
            age: user.age
        });
        setShowUpdateSection(true);
    };

    const handleUpdate = () => {
        if (!updateData.username) return;

        axios.patch('http://localhost:5050/update', {
            username: updateData.username,
            userData: updateData
        })
            .then(response => {
                if (response.data.success) {
                    fetchAllData();
                    setShowUpdateSection(false);
                    setUpdateData({
                        username: '',
                        firstname: '',
                        lastname: '',
                        salary: '',
                        age: ''
                    });
                }
            })
            .catch(err => console.log(err));
    };

    const handleSalarySearch = () => {
        if (!minSalary || !maxSalary) return;
        
        axios.get(`http://localhost:5050/search/salary/${minSalary}/${maxSalary}`)
            .then(response => {
                setUsers(response.data.data || []);
                setMinSalary('');
                setMaxSalary('');
            })
            .catch(err => console.log(err));
    };

    const handleAgeSearch = () => {
        if (!minAge || !maxAge) return;
        
        axios.get(`http://localhost:5050/search/age/${minAge}/${maxAge}`)
            .then(response => {
                setUsers(response.data.data || []);
                setMinAge('');
                setMaxAge('');
            })
            .catch(err => console.log(err));
    };

    const handleRegistrationSearch = () => {
        if (!referenceUser) return;
        
        setUsers([{ 
            username: 'Loading...', 
            firstname: 'Please wait', 
            lastname: '', 
            salary: 0, 
            age: 0 
        }]);
        
        const url = `http://localhost:5050/search/registered-after/${referenceUser.trim()}`;
        console.log('Making request to:', url);
        
        axios.get(url)
            .then(response => {
                console.log('Full response:', response);
                if (response.data && response.data.data) {
                    if (response.data.data.length === 0) {
                        setUsers([{
                            username: 'No Results',
                            firstname: 'No users found registered after',
                            lastname: referenceUser,
                            salary: 0,
                            age: 0
                        }]);
                    } else {
                        setUsers(response.data.data);
                    }
                } else {
                    setUsers([{
                        username: 'Error',
                        firstname: 'No data received from server',
                        lastname: '',
                        salary: 0,
                        age: 0
                    }]);
                }
                setReferenceUser('');
            })
            .catch(err => {
                console.error('Registration search error:', err);
                setUsers([{
                    username: 'Error',
                    firstname: 'Search failed',
                    lastname: err.message,
                    salary: 0,
                    age: 0
                }]);
            });
    };

    const handleNeverSignedInSearch = () => {
        setUsers([{ 
            username: 'Loading...', 
            firstname: 'Please wait', 
            lastname: '', 
            salary: 0, 
            age: 0 
        }]);
        
        axios.get('http://localhost:5050/search/never-signed-in')
            .then(response => {
                console.log('Never signed in search response:', response);
                if (response.data && response.data.data) {
                    if (response.data.data.length === 0) {
                        setUsers([{
                            username: 'No Results',
                            firstname: 'All users have signed in at least once',
                            lastname: '',
                            salary: 0,
                            age: 0
                        }]);
                    } else {
                        setUsers(response.data.data);
                    }
                } else {
                    setUsers([{
                        username: 'Error',
                        firstname: 'No data received from server',
                        lastname: '',
                        salary: 0,
                        age: 0
                    }]);
                }
            })
            .catch(err => {
                console.error('Never signed in search error:', err);
                setUsers([{
                    username: 'Error',
                    firstname: 'Search failed',
                    lastname: err.message,
                    salary: 0,
                    age: 0
                }]);
            });
    };

    const handleSameRegisterDaySearch = () => {
        if (!sameRegisterDayUser) return;
        
        setUsers([{ 
            username: 'Loading...', 
            firstname: 'Please wait', 
            lastname: '', 
            salary: 0, 
            age: 0 
        }]);
        
        const url = `http://localhost:5050/search/same-register-day/${sameRegisterDayUser.trim()}`;
        console.log('Making request to:', url);
        
        axios.get(url)
            .then(response => {
                console.log('Same register day search response:', response);
                if (response.data && response.data.data) {
                    if (response.data.data.length === 0) {
                        setUsers([{
                            username: 'No Results',
                            firstname: 'No other users registered on the same day as',
                            lastname: sameRegisterDayUser,
                            salary: 0,
                            age: 0
                        }]);
                    } else {
                        setUsers(response.data.data);
                    }
                } else {
                    setUsers([{
                        username: 'Error',
                        firstname: 'No data received from server',
                        lastname: '',
                        salary: 0,
                        age: 0
                    }]);
                }
                setSameRegisterDayUser('');
            })
            .catch(err => {
                console.error('Same register day search error:', err);
                setUsers([{
                    username: 'Error',
                    firstname: 'Search failed',
                    lastname: err.message,
                    salary: 0,
                    age: 0
                }]);
            });
    };

    const handleCurrentDateRegistrationsSearch = () => {
        setUsers([{ 
            username: 'Loading...', 
            firstname: 'Please wait', 
            lastname: '', 
            salary: 0, 
            age: 0 
        }]);
        
        axios.get('http://localhost:5050/search/registered-current-date')
            .then(response => {
                console.log('Current date registrations search response:', response);
                if (response.data && response.data.data) {
                    if (response.data.data.length === 0) {
                        setUsers([{
                            username: 'No Results',
                            firstname: 'No users registered on current date',
                            lastname: '',
                            salary: 0,
                            age: 0
                        }]);
                    } else {
                        setUsers(response.data.data);
                    }
                } else {
                    setUsers([{
                        username: 'Error',
                        firstname: 'No data received from server',
                        lastname: '',
                        salary: 0,
                        age: 0
                    }]);
                }
            })
            .catch(err => {
                console.error('Current date registrations search error:', err);
                setUsers([{
                    username: 'Error',
                    firstname: 'Search failed',
                    lastname: err.message,
                    salary: 0,
                    age: 0
                }]);
            });
    };

    return (
        <div className="container mt-5">

            {/* Search Section */}
            <div className="mb-3">
                <input 
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="form-control mb-2"
                    placeholder="Search by username or name"
                />
                <button 
                    onClick={handleSearch}
                    className="btn btn-secondary"
                >
                    Search
                </button>
            </div>

            {/* Salary Search Section */}
            <div className="mb-3 d-flex gap-2">
                <input 
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="form-control"
                    placeholder="Min Salary"
                />
                <input 
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="form-control"
                    placeholder="Max Salary"
                />
                <button 
                    onClick={handleSalarySearch}
                    className="btn btn-secondary"
                >
                    Search by Salary
                </button>
            </div>

            {/* Age Search Section */}
            <div className="mb-3 d-flex gap-2">
                <input 
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="form-control"
                    placeholder="Min Age"
                />
                <input 
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="form-control"
                    placeholder="Max Age"
                />
                <button 
                    onClick={handleAgeSearch}
                    className="btn btn-secondary"
                >
                    Search by Age
                </button>
            </div>

            {/* Registration Date Search Section */}
            <div className="mb-3 d-flex gap-2">
                <input 
                    type="text"
                    value={referenceUser}
                    onChange={(e) => setReferenceUser(e.target.value)}
                    className="form-control"
                    placeholder="Enter username (e.g., john)"
                />
                <button 
                    onClick={handleRegistrationSearch}
                    className="btn btn-secondary"
                >
                    Search Users Registered After
                </button>
            </div>

            {/* Never Signed In Search Section */}
            <div className="mb-3 d-flex gap-2">
                <button 
                    onClick={handleNeverSignedInSearch}
                    className="btn btn-secondary w-100"
                >
                    Show Users Who Never Signed In
                </button>
            </div>

            {/* Same Register Day Search Section */}
            <div className="mb-3 d-flex gap-2">
                <input 
                    type="text"
                    value={sameRegisterDayUser}
                    onChange={(e) => setSameRegisterDayUser(e.target.value)}
                    className="form-control"
                    placeholder="Enter username to find others registered same day"
                />
                <button 
                    onClick={handleSameRegisterDaySearch}
                    className="btn btn-secondary"
                >
                    Find Users Registered Same Day
                </button>
            </div>

            {/* Current Date Registrations Search Section */}
            <div className="mb-3 d-flex gap-2">
                <button 
                    onClick={handleCurrentDateRegistrationsSearch}
                    className="btn btn-secondary w-100"
                >
                    Show Users Registered Today
                </button>
            </div>

            {/* Update Section */}
            {showUpdateSection && (
                <div className="mb-3 p-3 border rounded">
                    <h4>Update User</h4>
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <input 
                                type="text"
                                value={updateData.firstname}
                                onChange={(e) => setUpdateData({...updateData, firstname: e.target.value})}
                                className="form-control"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input 
                                type="text"
                                value={updateData.lastname}
                                onChange={(e) => setUpdateData({...updateData, lastname: e.target.value})}
                                className="form-control"
                                placeholder="Last Name"
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input 
                                type="number"
                                value={updateData.salary}
                                onChange={(e) => setUpdateData({...updateData, salary: e.target.value})}
                                className="form-control"
                                placeholder="Salary"
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input 
                                type="number"
                                value={updateData.age}
                                onChange={(e) => setUpdateData({...updateData, age: e.target.value})}
                                className="form-control"
                                placeholder="Age"
                            />
                        </div>
                        <div className="col-12">
                            <button 
                                onClick={handleUpdate}
                                className="btn btn-success me-2"
                            >
                                Update
                            </button>
                            <button 
                                onClick={() => setShowUpdateSection(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Salary</th>
                        <th>Age</th>
                        <th>Register Date</th>
                        <th>Last Sign In</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center">No Data</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.username}>
                                <td>{user.username}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>${user.salary}</td>
                                <td>{user.age}</td>
                                <td>{user.registerday ? new Date(user.registerday).toLocaleString() : 'N/A'}</td>
                                <td>{user.signintime ? new Date(user.signintime).toLocaleString() : 'Never'}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(user.username)}
                                        className="btn btn-danger btn-sm me-2"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => showEditInterface(user)}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Home;