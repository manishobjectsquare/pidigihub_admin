// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toastify from "../../config/toastify";

// export default function Settings() {
//     const navigate = useNavigate();

//     const [formval, setFormval] = useState({
//         email_id: "",
//         phone_number: "",
//         whatsapp_number: "",
//         // address: {
//         //     street: "",
//         //     city: "",
//         //     state: "",
//         //     country: "",
//         //     zip: ""
//         // },
//         counts: {
//             students: "",
//             libraries: "",
//             tests: "",
//             mentors: "",
//             ebooks: ""
//         }
//     });

//     const changeHandler = (e) => {
//         const { name, value } = e.target;

//         // Handle nested fields
//         if (name.includes("address.")) {
//             const field = name.split(".")[1];
//             setFormval(prev => ({
//                 ...prev,
//                 address: {
//                     ...prev.address,
//                     [field]: value
//                 }
//             }));
//         } else if (name.includes("counts.")) {
//             const field = name.split(".")[1];
//             setFormval(prev => ({
//                 ...prev,
//                 counts: {
//                     ...prev.counts,
//                     [field]: value
//                 }
//             }));
//         } else {
//             setFormval(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const fetchLiveData = async () => {
//         try {
//             const response = await axios.get(`https://instructo.teachera.co/setting`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//             });

//             const data = response.data.data[0];

//             // If address is stored as a single string, you can split it into parts here
//             // const defaultAddress = {
//             //     street: "",
//             //     city: "",
//             //     state: "",
//             //     country: "",
//             //     zip: ""
//             // };

//             setFormval({
//                 email_id: data.email_id || "",
//                 phone_number: data.phone_number || "",
//                 whatsapp_number: data.whatsapp_number || "",
//                 // address: data.address || defaultAddress,
//                 counts: data.counts || {
//                     students: "",
//                     libraries: "",
//                     tests: "",
//                     mentors: "",
//                     ebooks: ""
//                 },
//                 _id: data._id
//             });
//         } catch (error) {
//             console.error("Fetch error", error);
//         }
//     };

//     useEffect(() => {
//         fetchLiveData();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             let response = await axios.patch(
//                 `https://api.basementex.com/setting/${formval._id}`,
//                 formval,
//                 {
//                     headers: { "Content-Type": "application/json" },
//                 }
//             );

//             if (!response?.data?.status) {
//                 toastify.error("Some error occurred");
//             } else {
//                 toastify.success("Settings updated");
//                 navigate(`/settings`);
//             }
//         } catch (error) {
//             console.error("Update error", error);
//         }
//     };

//     return (
//         <>
//             <section className="main-sec">
//                 <div className="row align-items-center">
//                     <div className="col-lg-6">
//                         <div className="dashboard-title">
//                             <h4 className="dash-head">
//                                 <i className="fa fa-cogs me-2" />
//                                 Manage Settings
//                             </h4>
//                         </div>
//                         <div className="custom-bredcump">
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item">
//                                         <Link to="/">Dashboard</Link>
//                                     </li>
//                                     <li className="breadcrumb-item active" aria-current="page">
//                                         Manage Settings
//                                     </li>
//                                 </ol>
//                             </nav>
//                         </div>
//                     </div>
//                     <div className="col-lg-6 d-flex justify-content-end">
//                         <Link to="/" className="btn btn-info text-white">
//                             <i className="fa fa-arrow-left me-1"></i>
//                             Back
//                         </Link>
//                     </div>
//                 </div>

//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="cards edit-usr">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="row">

//                                     {/* Email */}
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="email_id" className="form-label">Email Address</label>
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             name="email_id"
//                                             value={formval.email_id}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>

//                                     {/* Phone */}
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="phone_number" className="form-label">Phone Number</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="phone_number"
//                                             value={formval.phone_number}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>

//                                     {/* WhatsApp */}
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="whatsapp_number" className="form-label">WhatsApp Number</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="whatsapp_number"
//                                             value={formval.whatsapp_number}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>

//                                     {/* Address Fields */}
//                                     {/* <div className="col-lg-6 mb-4">
//                                         <label htmlFor="address.street" className="form-label">Street</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="address.street"
//                                             value={formval.address.street}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>
//                                     <div className="col-lg-4 mb-4">
//                                         <label htmlFor="address.city" className="form-label">City</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="address.city"
//                                             value={formval.address.city}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>
//                                     <div className="col-lg-4 mb-4">
//                                         <label htmlFor="address.state" className="form-label">State</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="address.state"
//                                             value={formval.address.state}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>
//                                     <div className="col-lg-4 mb-4">
//                                         <label htmlFor="address.zip" className="form-label">Zip Code</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="address.zip"
//                                             value={formval.address.zip}
//                                             onChange={changeHandler}
//                                         />
//                                     </div>
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="address.country" className="form-label">Country</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="address.country"
//                                             value={formval.address.country}
//                                             onChange={changeHandler}
//                                         />
//                                     </div> */}

//                                     {/* Counts Section */}
//                                     <div className="col-lg-12 mb-3">
//                                         <h5 className="mb-3">Counts</h5>
//                                         <div className="row">
//                                             <div className="col-lg-2 mb-4">
//                                                 <label className="form-label">Students</label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="counts.students"
//                                                     value={formval.counts.students}
//                                                     onChange={changeHandler}
//                                                 />
//                                             </div>
//                                             <div className="col-lg-2 mb-4">
//                                                 <label className="form-label">Libraries</label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="counts.libraries"
//                                                     value={formval.counts.libraries}
//                                                     onChange={changeHandler}
//                                                 />
//                                             </div>
//                                             <div className="col-lg-2 mb-4">
//                                                 <label className="form-label">Tests</label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="counts.tests"
//                                                     value={formval.counts.tests}
//                                                     onChange={changeHandler}
//                                                 />
//                                             </div>
//                                             <div className="col-lg-2 mb-4">
//                                                 <label className="form-label">Mentors</label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="counts.mentors"
//                                                     value={formval.counts.mentors}
//                                                     onChange={changeHandler}
//                                                 />
//                                             </div>
//                                             {/* <div className="col-lg-2 mb-4">
//                                                 <label className="form-label">Ebooks</label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="counts.ebooks"
//                                                     value={formval.counts.ebooks}
//                                                     onChange={changeHandler}
//                                                 />
//                                             </div> */}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-12 text-center">
//                                         <button type="submit" className="btn btn-for-add text-white">
//                                             <i className="fa fa-save me-1"></i>
//                                             Save Settings
//                                         </button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div >
//             </section >
//         </>
//     );
// }
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toastify from "../../config/toastify";
import { baseUrl } from "../../config/baseUrl";

export default function Settings() {
    const navigate = useNavigate();

    const [formval, setFormval] = useState({
        email_id: "",
        phone_number: "",
        whatsapp_number: "",
        // address: {
        //     street: "",
        //     city: "",
        //     state: "",
        //     country: "",
        //     zip: ""
        // },
        counts: {
            students: "",
            libraries: "",
            tests: "",
            mentors: "",
            // ebooks: ""
        }
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;

        if (name.includes("address.")) {
            const field = name.split(".")[1];
            setFormval(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else if (name.includes("counts.")) {
            const field = name.split(".")[1];
            setFormval(prev => ({
                ...prev,
                counts: {
                    ...prev.counts,
                    [field]: value
                }
            }));
        } else {
            setFormval(prev => ({ ...prev, [name]: value }));
        }
    };

    const fetchLiveData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/setting`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = response.data.data[0];

            setFormval({
                email_id: data.email_id || "",
                phone_number: data.phone_number || "",
                whatsapp_number: data.whatsapp_number || "",
                // address: data.address || {
                //     street: "",
                //     city: "",
                //     state: "",
                //     country: "",
                //     zip: ""
                // },
                counts: data.counts || {
                    students: "",
                    libraries: "",
                    tests: "",
                    mentors: "",
                    // ebooks: ""
                },
                _id: data._id
            });
        } catch (error) {
            console.error("Fetch error", error);
        }
    };

    useEffect(() => {
        fetchLiveData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${baseUrl}/setting/${formval._id}`,
                formval,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    }
                }
            );

            if (!response?.data?.status) {
                toastify.error("Some error occurred");
            } else {
                toastify.success("Settings updated");
                navigate(`/settings`);
            }
        } catch (error) {
            console.error("Update error", error);
        }
    };

    return (
        <section className="main-sec">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="dashboard-title">
                        <h4 className="dash-head">
                            <i className="fa fa-cogs me-2" />
                            Manage Settings
                        </h4>
                    </div>
                    <div className="custom-bredcump">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Manage Settings
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                    <Link to="/" className="btn btn-info text-white">
                        <i className="fa fa-arrow-left me-1"></i>
                        Back
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="cards edit-usr">
                        <form onSubmit={handleSubmit}>
                            <div className="row">

                                {/* Email */}
                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="email_id" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email_id"
                                        value={formval.email_id}
                                        onChange={changeHandler}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone_number"
                                        value={formval.phone_number}
                                        onChange={changeHandler}
                                    />
                                </div>

                                {/* WhatsApp */}
                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="whatsapp_number" className="form-label">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="whatsapp_number"
                                        value={formval.whatsapp_number}
                                        onChange={changeHandler}
                                    />
                                </div>

                                {/* Address Fields (Commented) */}
                                {/*
                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="address.street" className="form-label">Street</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address.street"
                                        value={formval.address.street}
                                        onChange={changeHandler}
                                    />
                                </div>
                                <div className="col-lg-4 mb-4">
                                    <label htmlFor="address.city" className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address.city"
                                        value={formval.address.city}
                                        onChange={changeHandler}
                                    />
                                </div>
                                <div className="col-lg-4 mb-4">
                                    <label htmlFor="address.state" className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address.state"
                                        value={formval.address.state}
                                        onChange={changeHandler}
                                    />
                                </div>
                                <div className="col-lg-4 mb-4">
                                    <label htmlFor="address.zip" className="form-label">Zip Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address.zip"
                                        value={formval.address.zip}
                                        onChange={changeHandler}
                                    />
                                </div>
                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="address.country" className="form-label">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address.country"
                                        value={formval.address.country}
                                        onChange={changeHandler}
                                    />
                                </div>
                                */}

                                {/* Counts Section */}
                                <div className="col-lg-12 mb-3">
                                    <h5 className="mb-3">Counts</h5>
                                    <div className="row">
                                        <div className="col-lg-2 mb-4">
                                            <label className="form-label">Students</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="counts.students"
                                                value={formval.counts.students}
                                                onChange={changeHandler}
                                            />
                                        </div>
                                        <div className="col-lg-2 mb-4">
                                            <label className="form-label">Libraries</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="counts.libraries"
                                                value={formval.counts.libraries}
                                                onChange={changeHandler}
                                            />
                                        </div>
                                        <div className="col-lg-2 mb-4">
                                            <label className="form-label">Tests</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="counts.tests"
                                                value={formval.counts.tests}
                                                onChange={changeHandler}
                                            />
                                        </div>
                                        <div className="col-lg-2 mb-4">
                                            <label className="form-label">Mentors</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="counts.mentors"
                                                value={formval.counts.mentors}
                                                onChange={changeHandler}
                                            />
                                        </div>
                                        {/* 
                                        <div className="col-lg-2 mb-4">
                                            <label className="form-label">Ebooks</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="counts.ebooks"
                                                value={formval.counts.ebooks}
                                                onChange={changeHandler}
                                            />
                                        </div>
                                        */}
                                    </div>
                                </div>

                                <div className="col-lg-12 text-center">
                                    <button type="submit" className="btn btn-for-add text-white">
                                        <i className="fa fa-save me-1"></i>
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
