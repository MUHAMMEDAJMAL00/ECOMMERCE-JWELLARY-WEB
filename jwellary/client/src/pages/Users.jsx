import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyNavbar from "../pages/MyNavbar";

const Users = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users?search=${query}&page=${page}&limit=5`)
      .then((result) => {
        setUsers(result.data.users || []);
        setTotalPages(result.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [query, page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteUser/" + id)
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <MyNavbar />

      <div className="container py-5">
        <div className="card shadow border-0 rounded-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
            <h4 className="mb-0">User Management</h4>
            <Link to="/auth/create" className="btn btn-light fw-semibold">
              + Add New
            </Link>
          </div>

          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control shadow-sm"
                  placeholder=" Search users by name or email"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-muted">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="fw-semibold">{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.age}</td>
                        <td>
                          <Link
                            to={`/auth/view/${user._id}`}
                            className="btn btn-outline-info btn-sm me-2"
                          >
                            View
                          </Link>
                          <Link
                            to={`/auth/Update/${user._id}`}
                            className="btn btn-outline-warning btn-sm me-2"
                          >
                            Update
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="btn btn-outline-secondary"
              >
                ⬅ Previous
              </button>
              <span className="fw-medium">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="btn btn-outline-secondary"
              >
                Next ➡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
