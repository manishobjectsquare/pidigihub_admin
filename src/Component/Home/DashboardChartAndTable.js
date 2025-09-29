

import { useState } from "react"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import { baseUrl } from "../../config/baseUrl"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const DashboardChartAndTable = ({ dashboardData }) => {
    const [selectedYear, setSelectedYear] = useState("2025")
    const [selectedMonth, setSelectedMonth] = useState("June")
    const [activeTab, setActiveTab] = useState("students")

    // Generate mock sales data for the chart
    // In a real application, this would come from your API
    const generateSalesData = () => {
        const daysInMonth = new Date(Number.parseInt(selectedYear), getMonthNumber(selectedMonth), 0).getDate()
        const data = Array(daysInMonth).fill(0)

        // Add some sample data points
        data[0] = 60
        data[1] = 50
        data[2] = 5

        // Add purchase data if available
        if (dashboardData?.recent_purchases && dashboardData.recent_purchases.length > 0) {
            dashboardData.recent_purchases.forEach((purchase) => {
                const purchaseDate = new Date(purchase.createdAt)
                if (
                    purchaseDate.getMonth() === getMonthNumber(selectedMonth) - 1 &&
                    purchaseDate.getFullYear() === Number.parseInt(selectedYear)
                ) {
                    const day = purchaseDate.getDate() - 1 // Arrays are 0-indexed
                    data[day] += purchase.price || 1 // Add purchase amount or 1 if free
                }
            })
        }

        return data
    }

    const getMonthNumber = (monthName) => {
        const months = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12,
        }
        return months[monthName]
    }

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { year: "numeric", month: "short", day: "numeric" }
        return date.toLocaleDateString(undefined, options)
    }

    // Calculate time difference for "X days/months ago" display
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 30) {
            return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
        } else {
            const diffMonths = Math.floor(diffDays / 30)
            return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`
        }
    }

    // Chart data
    const chartData = {
        labels: Array.from(
            { length: new Date(Number.parseInt(selectedYear), getMonthNumber(selectedMonth), 0).getDate() },
            (_, i) => i + 1,
        ),
        datasets: [
            {
                label: "Sales",
                data: generateSalesData(),
                borderColor: "rgb(65, 105, 225)",
                backgroundColor: "rgba(65, 105, 225, 0.5)",
                tension: 0.1,
                pointRadius: 3,
            },
        ],
    }

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
            },
            x: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
            },
        },
    }

    return (
        <>
            {/* Sales Chart Section */}
            <div className="col-lg-12">
                <div className="cards">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="chart-head mb-3">
                                <h4 className="dash-head2 mb-1">
                                    Sales In {selectedMonth}, {selectedYear}
                                </h4>
                                <p>Course sales throughout the period</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="chart-fltr text-end">
                                <div className="row">
                                    <div className="col-lg-6 text-end">
                                        <div className="row gx-2 align-items-center">
                                            <div className="col-lg-3 col-md-4">
                                                <label htmlFor="year-select" className="col-form-label">
                                                    Year:
                                                </label>
                                            </div>
                                            <div className="col-lg-9 col-md-8">
                                                <select
                                                    id="year-select"
                                                    className="form-select"
                                                    value={selectedYear}
                                                    onChange={(e) => setSelectedYear(e.target.value)}
                                                >
                                                    <option value="2025">2025</option>
                                                    <option value="2024">2024</option>
                                                    <option value="2023">2023</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 text-end">
                                        <div className="row gx-2 align-items-center">
                                            <div className="col-lg-3 col-md-4">
                                                <label htmlFor="month-select" className="col-form-label">
                                                    Month:
                                                </label>
                                            </div>
                                            <div className="col-lg-9 col-md-8">
                                                <select
                                                    id="month-select"
                                                    className="form-select"
                                                    value={selectedMonth}
                                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                                >
                                                    <option value="January">January</option>
                                                    <option value="February">February</option>
                                                    <option value="March">March</option>
                                                    <option value="April">April</option>
                                                    <option value="May">May</option>
                                                    <option value="June">June</option>
                                                    <option value="July">July</option>
                                                    <option value="August">August</option>
                                                    <option value="September">September</option>
                                                    <option value="October">October</option>
                                                    <option value="November">November</option>
                                                    <option value="December">December</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: "300px" }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>



            {/* Data Tables */}
            <div className="col-lg-12">
                <div className="row">
                    {/* Recent Students */}

                    <div className="col-lg-4 col-md-4 col-12">
                        <div
                            className="cards"
                            style={{
                                background: "#008080",
                                borderRadius: "10px 10px 0 0",
                            }}
                        >
                            <div className="card-body p-3">
                                <h5 className="text-white mb-1">Recent Students</h5>
                                <p className="text-white mb-0">Recently Joined Students</p>
                            </div>
                        </div>
                        <div className="cards mt-0 pt-0" style={{ borderRadius: "0 0 10px 10px" }}>
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush">
                                    {dashboardData?.recent_students?.map((student) => (
                                        <li key={student._id} className="list-group-item border-0 py-3 d-flex align-items-start">
                                            <img
                                                src={`${baseUrl}${student.image}`}
                                                alt={student.name}
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = "/jslogo.png"
                                                }}
                                                className="rounded-circle me-3"
                                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 text-primary">{student.name}</h6>
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <span
                                                        className={`badge ${student.status === "active"
                                                            ? "bg-success"
                                                            : student.status === "inactive"
                                                                ? "bg-danger"
                                                                : "bg-warning"
                                                            } me-2`}
                                                    >
                                                        {student.status}
                                                    </span>
                                                    <span className="text-muted small">{formatDate(student.createdAt)}</span>
                                                    {student.rating && (
                                                        <span className="ms-2">
                                                            <span className="text-warning">★</span> {student.rating}/5
                                                        </span>
                                                    )}
                                                </div>
                                                {student.student_desc && <p className="text-muted mt-1 mb-0 small">{student.student_desc}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>


                    {/* Recent Packages */}

                    <div className="col-lg-4 col-md-4 col-12">
                        <div
                            className="cards"
                            style={{
                                background: "#008080",
                                borderRadius: "10px 10px 0 0",
                            }}
                        >
                            <div className="card-body p-3">
                                <h5 className="text-white mb-1">Recent Packages</h5>
                                <p className="text-white mb-0">Latest Added Packages</p>
                            </div>
                        </div>
                        <div className="cards mt-0 pt-0" style={{ borderRadius: "0 0 10px 10px" }}>
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush">
                                    {dashboardData?.recent_packages?.map((pkg) => (
                                        <li key={pkg._id} className="list-group-item border-0 py-3">
                                            <div className="d-flex align-items-center">
                                                {pkg.image && (
                                                    <div className="me-3">
                                                        <img
                                                            src={`${baseUrl}/${pkg.image}` || "/jslogo.png"}
                                                            alt={pkg.title}
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.src = "/jslogo.png"
                                                            }}
                                                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 text-primary">{pkg.title}</h6>
                                                    <div className="d-flex align-items-center flex-wrap">
                                                        <span className={`badge ${pkg.status === "active" ? "bg-success" : "bg-danger"} me-2`}>
                                                            {pkg.status}
                                                        </span>
                                                        <span className="text-muted small">{formatDate(pkg.createdAt)}</span>
                                                        <span className="badge bg-info ms-2">₹{pkg.price}</span>
                                                    </div>
                                                    {pkg.description && (
                                                        <p className="text-muted mt-1 mb-0 small">
                                                            {pkg.description.length > 100
                                                                ? `${pkg.description.substring(0, 100)}...`
                                                                : pkg.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>


                    {/* Recent Categories */}

                    <div className="col-lg-4 col-md-4 col-12">
                        <div
                            className="cards"
                            style={{
                                background: "#008080",
                                borderRadius: "10px 10px 0 0",
                            }}
                        >
                            <div className="card-body p-3">
                                <h5 className="text-white mb-1">Recent Categories</h5>
                                <p className="text-white mb-0">Latest Added Categories</p>
                            </div>
                        </div>
                        <div className="cards mt-0 pt-0" style={{ borderRadius: "0 0 10px 10px" }}>
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush">
                                    {dashboardData?.recent_categories?.map((category) => (
                                        <li key={category._id} className="list-group-item border-0 py-3">
                                            <div className="d-flex align-items-center">
                                                {category.image && (
                                                    <div className="me-3">
                                                        <img
                                                            src={`${baseUrl}/${category.image}` || "/jslogo.png"}
                                                            alt={category.title}
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.src = "/jslogo.png"
                                                            }}
                                                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 text-primary">{category.title}</h6>
                                                    <div className="d-flex align-items-center flex-wrap">
                                                        <span
                                                            className={`badge ${category.status === "active" ? "bg-success" : "bg-danger"} me-2`}
                                                        >
                                                            {category.status}
                                                        </span>
                                                        <span className="text-muted small">{formatDate(category.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>
                {`
        /* Additional styles for the dashboard components */
        .cards {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          padding: 20px;
        }
        
        .chart-head h4 {
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .chart-head p {
          color: #6c757d;
          font-size: 14px;
        }
        
        .list-group-item {
          transition: background-color 0.2s;
        }
        
        .list-group-item:hover {
          background-color: #f8f9fa;
        }
        
        .text-primary {
          color: #4E0094 !important;
        }
        
        .badge {
          font-weight: 500;
          padding: 0.35em 0.65em;
        }
        
        .bg-success {
          background-color: #28a745 !important;
        }
        
        .bg-warning {
          background-color: #ffc107 !important;
        }
        
        .bg-danger {
          background-color: #dc3545 !important;
        }
        
        .bg-info {
          background-color: #17a2b8 !important;
        }
        
        .dashboard-tabs .nav-tabs {
          border-bottom: 2px solid #e9ecef;
          margin-bottom: 1.5rem;
        }
        
        .dashboard-tabs .nav-link {
          color: #6c757d;
          border: none;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .dashboard-tabs .nav-link:hover {
          color: #4E0094;
        }
        
        .dashboard-tabs .nav-link.active {
          color: #4E0094;
          background: transparent;
          border-bottom: 3px solid #4E0094;
        }
        `}
            </style>
        </>
    )
}

export default DashboardChartAndTable
