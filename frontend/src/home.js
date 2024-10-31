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