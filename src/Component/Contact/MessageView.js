
import { Link } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl"
export default function MessageView() {


    const [message, setMessage] = useState([]);
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/contactus`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setMessage(response.data.data);
        } catch (error) {
            console.log("error", error);
        }
    };
    return (
        <>
            <section className="main-sec">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-users me-2" />
                                View Message
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        View Message
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end">
                        <Link to="/testimonials" className="btn btn-info text-white">
                            <i className="fa fa-arrow-left me-1"></i>
                            Back
                        </Link>
                    </div>
                </div>
                <div className="row">

                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <table className="table table-striped">
                                    {message.map((msg) => (
                                        <tbody key={msg._id}>
                                            <tr>
                                                <td>Name</td>
                                                <td>{msg.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>
                                                    <a href="mailto:">{msg.email}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Subject</td>
                                                <td>{msg.subject}</td>
                                            </tr>
                                            <tr>
                                                <td>Message</td>
                                                <td>{msg.message}</td>
                                            </tr>
                                            {/* <tr>
                                                <td>Created at</td>
                                                <td>{msg?.created_at}</td>
                                            </tr> */}
                                            <tr>
                                                <td>Action</td>
                                                <td>
                                                    <button

                                                        className="btn btn-danger btn-sm"
                                                        data-toggle="modal"
                                                        data-target="#deleteModal"
                                                    >
                                                        <i className="fa fa-trash"></i> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
