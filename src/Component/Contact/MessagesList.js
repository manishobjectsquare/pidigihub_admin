import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import moment from "moment";
import { baseUrl } from "../../config/baseUrl";


export default function MessagesList() {


    const [message, setMessage] = useState([]);
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/contactus/getcontactus`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setMessage(response.data);
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <>
            <section className="main-sec">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-chart-bar me-2" />
                                Messgae List
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Contact Messages
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row ">
                                    <div className="col-lg-6">
                                        <h5 class="card-title">Message List</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="table table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Subject</th>
                                            <th>Message</th>
                                            <th>Created At</th>
                                            {/* <th>Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {message.map((msg, i) => {
                                            return (
                                                <tr key={msg?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <span>{msg?.subject}</span> <br />
                                                    </td>
                                                    <td>
                                                        {msg?.message}
                                                    </td>
                                                    <td>
                                                        <span>{moment(msg?.createdAt).format('lll')}</span>
                                                    </td>

                                                    {/* <td>
                                                        <div className="action-buttons">
                                                            <Link
                                                                className="action-btn edit-btn"
                                                                to={`view/${msg._id}`}
                                                            >
                                                                <i className="fa fa-eye" />
                                                            </Link>
                                                            <button
                                                                title="Delete"
                                                                className="action-btn delete-btn"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                                <span className="tooltip-text">View</span>
                                                            </button>
                                                        </div>
                                                    </td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
