import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyNavbar from "./MyNavbar";

const CreateUser = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [age, setAge] = useState();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/createUser", { name, email, age })
      .then((result) => {
        console.log(result);
        navigate("/homee");
      })

      .catch((err) => console.log(err));
  };

  return (
    <div>
      <MyNavbar />;
      <div className="vh-100 d-flex justify-content-center bg-white align-items-center ">
        <div className="w-50 shadow rounded bg-white p-3">
          <form onSubmit={submit}>
            <h2>Add User</h2>
            <div className="mb-2">
              <label htmlFor="">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="">Email</label>
              <input
                type="Email"
                placeholder="Enter Email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Age</label>
              <input
                type="number"
                placeholder="Enter Number"
                className="form-control"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <button className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
