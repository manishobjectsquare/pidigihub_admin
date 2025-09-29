import React, { useEffect, useState } from "react";

const ArshadStudentList = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchStudents = () => {
    setLoading(true);
    fetch("https://api.basementex.com/api/v1/admin/user/user-list")
      .then((response) => response.json())
      .then((data) => setStudent(data.data));
    setLoading(false);
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  console.log(student.image);

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <table>
              <thead>
                <tr>
                  <td>SN</td>
                  <td>Id</td>
                  <td>Name</td>
                  <td>E-mail</td>
                  <td>Role</td>
                  <td>Image</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-center">
                    <td>Loadinggg....</td>
                  </tr>
                ) : (
                  student.map((std, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{std._id}</td>
                      <td>{std.name}</td>
                      <td>{std.email}</td>
                      <td>{std.role}</td>
                      <td>
                        <img src={std.image} alt="" width={100} />
                      </td>
                      <td>{std.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArshadStudentList;
