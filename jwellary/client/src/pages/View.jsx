import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const [users, setUsers] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/${id}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!users)
    return <p className="text-center mt-5">Loading user details...</p>;

  return (
    <div className="container py-5 mt-5 p-5 ">
      <div className="row justify-content-center ">
        <div className="col-md-8 col-lg-6 ">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body bg-gray rounded-4">
              <h3 className="text-center mb-4 text-primary fw-bold">
                👤 User Details
              </h3>
              <hr />
              <div className="mb-3">
                <h5 className="text-secondary">Name</h5>
                <p className="fs-5 fw-semibold">{users.name}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-secondary">Email</h5>
                <p className="fs-5 fw-semibold">{users.email}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-secondary">Age</h5>
                <p className="fs-5 fw-semibold">{users.age}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
