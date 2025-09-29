"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import empty from "../../assets/images/empty-box.png"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faPlus, faEye, faEdit, faTrash, faCheck, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

export default function NotificationList() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/notification`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      setNotifications(response.data.data || response.data)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (Id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`${baseUrl}/notification//${Id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification status");
      }

      const result = await response.json();

      if (result.status) {
        const updatedNotifications = notifications.map((notification) =>
          notification._id === Id ? { ...notification, status: newStatus } : notification
        );
        setNotifications(updatedNotifications);
        toast.success("Notification status changed!");
      } else {
        throw new Error(result.message || "Failed to update notification status");
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast.error("Failed to update notification status. Please try again.");
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/notification/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        fetchNotifications()
        Swal.fire("Deleted!", "Notification has been deleted.", "success")
      } catch (error) {
        Swal.fire("Error!", "Failed to delete notification.", "error")
      }
    }
  }

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const truncateText = (text, maxLength = 100) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <>
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  Notifications
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Notifications
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-notification btn-info">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Notification
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">All Notifications ({filteredNotifications.length})</h5>
                    </div>
                  </div>
                </div>


                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Notification</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="loading-spinner">
                            <div className="spinner"></div>
                          </td>
                        </tr>
                      ) : filteredNotifications.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <img src={empty || "/placeholder.svg"} alt="No notifications" width="200px" />
                            <h4>No Notifications found!</h4>
                            <p className="text-muted">
                              {searchTerm
                                ? "Try adjusting your search criteria"
                                : "Start by adding your first notification"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredNotifications.map((notification, i) => (
                          <tr key={notification?._id}>
                            <td>{i + 1}</td>
                            <td>
                              <div className="notification-info">
                                <img
                                  src={
                                    notification?.image
                                      ? `${baseUrl}/uploads/${notification.image}`
                                      : "/placeholder.svg?height=60&width=60"
                                  }
                                  alt={notification?.title}
                                  className="notification-image"
                                  style={{ width: '100px' }}
                                />
                                <div className="notification-details">
                                  <h6>{notification?.title}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p>{truncateText(notification?.message, 100)}</p>
                            </td>
                            <td>
                              <button
                                onClick={() => handleToggleStatus(notification?._id, notification?.status)}
                                className={`status-badge ${notification.status === "active" ? "status-active" : "status-inactive"
                                  }`}
                              >
                                {notification?.status === "active" ? (
                                  <>
                                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                                    Inactive
                                  </>
                                )}
                              </button>
                            </td>
                            <td>
                              <div className="action-buttons">
                                {/* <Link to={`/notifications/view/${notification?._id}`} className="action-btn view-btn">
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="tooltip-text">View</span>
                                </Link> */}
                                <Link to={`/notifications/edit/${notification?._id}`} className="action-btn edit-btn">
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(notification?._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                  <span className="tooltip-text">Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
