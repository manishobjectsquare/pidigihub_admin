import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast, Slide } from "react-toastify"
import Swal from "sweetalert2"

export default function BlogList() {
    const [blogList, setBlogList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlogList()
    }, [])

    const fetchBlogList = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://api.basementex.com/blog`, {
                headers: {
                    "Content-type": "application/json",
                },
            })
            setBlogList(response.data.data)
            setLoading(false)
        } catch (error) {
            console.log("error", error)
            setLoading(false)
        }
    }

    const handleDelete = async (blogId) => {
        // Show confirmation dialog using SweetAlert2
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`https://api.basementex.com/blog/${blogId}`, {
                        headers: {
                            "Content-type": "application/json",
                        },
                    })

                    if (response.data.status) {
                        // Show success message
                        Swal.fire("Deleted!", "Blog has been deleted successfully.", "success")

                        // Update the UI by removing the deleted blog
                        setBlogList((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId))

                        // Also show toast notification
                        toast.success("Blog deleted successfully", {
                            position: "top-right",
                            autoClose: 3000,
                            transition: Slide,
                        })
                    } else {
                        Swal.fire("Error!", response.data.message || "Failed to delete blog.", "error")
                    }
                } catch (error) {
                    console.error("Delete Error:", error)
                    Swal.fire("Error!", "Something went wrong while deleting the blog.", "error")
                }
            }
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)

        const timeOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }

        const dateOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        }

        const time = date.toLocaleTimeString(undefined, timeOptions)
        const fullDate = date.toLocaleDateString(undefined, dateOptions)

        return `${time}, ${fullDate}`
    }

    return (
        <>
            <section className="main-sec">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-chart-bar me-2" />
                                Blog List
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Blog List
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        <Link to="add" className="btn py-2 px-5 text-white btn-for-add">
                            <i className="fa fa-plus me-2"></i>
                            Add New
                        </Link>
                    </div>

                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row ">
                                    <div className="col-lg-6">
                                        <h5 className="card-title">Blog List</h5>
                                    </div>
                                </div>
                            </div>
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading blogs...</p>
                                </div>
                            ) : (
                                <div className="table table-responsive custom-table">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th>SN</th>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blogList.length > 0 ? (
                                                blogList.map((blog, i) => {
                                                    return (
                                                        <tr key={blog?._id}>
                                                            <td>{i + 1}</td>
                                                            <td>
                                                                <img
                                                                    src={`https://api.basementex.com/${blog?.image}`}
                                                                    alt="blog"
                                                                    className="img-fluid"
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null
                                                                        e.target.src = "/blog-concept.png"
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <span>
                                                                    {blog?.title}
                                                                    <p>({blog?.category?.title})</p>
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span>
                                                                    <h6>{formatDate(blog.createdAt)}</h6>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="action-buttons">
                                                                    <Link className="action-btn edit-btn" to={`edit/${blog?._id}`}>
                                                                        <i className="fa fa-edit" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(blog?._id)}
                                                                        type="button"
                                                                        title="Delete"
                                                                        className="action-btn delete-btn"
                                                                    >
                                                                        <i className="fa fa-trash"></i>
                                                                        <span className="tooltip-text">Delete</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No blogs found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

