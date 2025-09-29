
import { useEffect, useState, useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faBookOpen,
  faUsers,
  faFileAlt,
  faTags,
  faBoxOpen,
  faCalendar
} from "@fortawesome/free-solid-svg-icons"
import loaderContext from "../../context/LoaderContext"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import moment from "moment/moment"
import { Calendar } from "lucide-react"

export default function Dashboard() {
  const { setLoader } = useContext(loaderContext)
  const [dashboardCounts, setDashboardCounts] = useState({})

  useEffect(() => {
    fetchDashboardCounts()
  }, [])

  const fetchDashboardCounts = async () => {
    try {
      setLoader(true)
      const response = await axios.get(`${baseUrl}/admin/dashboard`)
      setDashboardCounts(response?.data.data)
    } catch (error) {
      console.error("Error fetching dashboard counts:", error)
    } finally {
      setLoader(false)
    }
  }

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard-title">
              <h4 className="dash-head">
                Dashboard
              </h4>
            </div>
          </div>



          <div className="col-lg-12 col-md-8">
            <div className="row">
              <div className="col-lg-12">
                <div className="summary-cards-grid">
                  <div className="summary-card total-revenue">
                    <div className="summary-icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="summary-content">
                      <h6 className="text-white">Users</h6>
                      <h4 className="text-white">{dashboardCounts?.users || 0}</h4>
                    </div>
                  </div>
                  <div className="summary-card total-commission">
                    <div className="summary-icon">
                      <FontAwesomeIcon icon={faBookOpen} />
                    </div>
                    <div className="summary-content">
                      <h6 className="text-white">Libraries</h6>
                      <h4 className="text-white">{dashboardCounts?.libraries || 0}</h4>
                    </div>
                  </div>
                  <div className="summary-card remaining-amount">
                    <div className="summary-icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="summary-content">
                      <h6 className="text-white">Mentors</h6>
                      <h4 className="text-white">{dashboardCounts?.mentors || 0}</h4>
                    </div>
                  </div>
                  <div className="summary-card payment-status">
                    <div className="summary-icon">
                      <FontAwesomeIcon icon={faFileAlt} />
                    </div>
                    <div className="summary-content">
                      <h6 className="text-white">Ebooks</h6>
                      <h4 className="text-white">{dashboardCounts?.ebooks || 0}</h4>
                    </div>
                  </div>
                  <div className="summary-card coupons">
                    <div className="summary-icon">
                      <FontAwesomeIcon icon={faTags} />
                    </div>
                    <div className="summary-content">
                      <h6 className="text-white">Coupons</h6>
                      <h4 className="text-white">{dashboardCounts?.coupons || 0}</h4>
                    </div>
                  </div>

                  <div className="summary-card packages">
                    <div className="summary-icon">
                      <FontAwesomeIcon icon={faBoxOpen} />
                    </div>
                    <div className="summary-content">
                      <h6 className="text-white">Packages</h6>
                      <h4 className="text-white">{dashboardCounts?.packages || 0}</h4>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mt-5">
            <div className="recent-students-card">
              <div className="students-header">
                <h6 className="mb-0 text-white">
                  <i className="fa fa-users me-2"></i>
                  Recent Bookings
                </h6>
                <span className="badge bg-light text-dark">
                  {dashboardCounts?.recentLibarayBookingStudents?.length || 0} New
                </span>
              </div>
              <div className="students-content">
                {dashboardCounts?.recentLibarayBookingStudents?.length > 0 ? (
                  dashboardCounts?.recentLibarayBookingStudents.map((student, index) => (
                    <div key={index} className="student-item">
                      <div className="student-avatar">
                        <i className="fa fa-user"></i>
                      </div>
                      <div className="student-details">
                        <h6 className="student-name">{student.name}</h6>
                        <p className="student-email">{student.email}</p>
                        <div className="student-meta">
                          <span className={`payment-badge ${student.paymentMode}`}>
                            {student.paymentMode}
                          </span>
                          <span className="join-date">
                            {new Date(student.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="fa fa-users fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No recent bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-5">
            <div className="recent-students-card">
              <div className="students-header">
                <h6 className="mb-0 text-white">
                  <i className="fa fa-users me-2"></i>
                  Recent Users
                </h6>
                <span className="badge bg-light text-dark">
                  {dashboardCounts?.recentUser?.length || 0} New
                </span>
              </div>
              <div className="students-content">
                {dashboardCounts?.recentUser?.length > 0 ? (
                  dashboardCounts?.recentUser.map((student, index) => (
                    <div key={index} className="student-item">
                      <div className="student-avatar">
                        <i className="fa fa-user"></i>
                      </div>
                      <div className="student-details">
                        <h6 className="student-name">{student.name}</h6>
                        <p className="student-email">{student.email}</p>
                        <div className="student-meta">
                          <Calendar size={12} />
                          <span className="join-date">
                            {moment(student?.joinedAt).format("ll")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="fa fa-users fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No recent bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .summary-cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.25rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
          }

          .summary-card:hover {
            transform: translateY(-2px);
          }

          .summary-card.total-revenue {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          }

          .summary-card.total-commission {
            background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
          }

          .summary-card.remaining-amount {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
          }

          .summary-card.payment-status {
            background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
          }
  .summary-card.coupons {
  background: linear-gradient(135deg, #f12711 0%, #f5af19 100%);
}
.summary-card.packages {
  background: linear-gradient(135deg, #396afc 0%, #2948ff 100%);
}

          .summary-icon {
            background: rgba(255,255,255,0.2);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
          }

          .summary-content h6 {
            margin: 0;
            font-size: 0.875rem;
            opacity: 0.9;
            font-weight: 500;
          }

          .summary-content h4 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
          }
        `}
      </style>
      <style >{`
        .dashboard-table-card,
        .dashboard-chart-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          overflow: hidden;
        }

        .table-header,
        .chart-header {
          background: #26a084;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-header h6,
        .chart-header h6 {
          font-weight: 600;
          font-size: 20px;
          margin: 0;
          color: #fff !important;
        }
        .table thead th{
            background:#26a084;
        }
        .header-actions .badge {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white;
        }

        .chart-controls {
          display: flex;
          gap: 8px;
        }

        .chart-controls .btn {
          padding: 4px 12px;
          font-size: 12px;
          border-radius: 6px;
        }

        .table {
          font-size: 13px;
          margin: 0;
        }

        .table th {
          background: #f8fafc;
          border-top: none;
          font-weight: 600;
          color: #374151;
          padding: 12px 15px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table td {
          padding: 15px;
          vertical-align: middle;
          border-top: 1px solid #f1f5f9;
        }

        .table-hover tbody tr:hover {
          background-color: #f8fafc;
        }

        .slot-id-badge {
          background: #4f46e5;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .time-slot {
          font-size: 13px;
          color: #374151;
        }

        .price-tag {
          background: #059669;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .seat-count {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
        }

        .total-seats {
          background: #e5e7eb;
          color: #374151;
        }

        .booked-seats {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .available-seats {
          background: #d1fae5;
          color: #059669;
        }

        .revenue-amount {
          color: #059669;
          font-weight: 600;
        }

        .occupancy-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .progress-bar-container {
          width: 60px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .occupancy-text {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
        }

        .chart-container {
          padding: 30px 20px;
          height: 400px;
        }

        .chart-container-small {
          padding: 20px;
          height: 300px;
        }

        .summary-cards-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          height: 100%;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
        }

        .summary-contentt {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .summary-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }

        .revenue-summary .summary-icon {
          background: #059669;
        }

        .occupancy-summary .summary-icon {
          background: #dc2626;
        }

        .summary-details h4 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 5px 0;
          color: #111827;
        }

        .summary-details p {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 3px 0;
        }

        .summary-details small {
          font-size: 12px;
          color: #6b7280;
        }

        .occupancy-chart-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          flex: 1;
        }

        .recent-students-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          overflow: hidden;
        }

        .students-header {
          background: #26a084;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .students-header h6 {
          font-size: 20px;
        }
        .students-content {
          padding: 20px;
          max-height: 450px;
          overflow-y: auto;
        }

        .student-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .student-item:last-child {
          border-bottom: none;
        }

        .student-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }

        .student-details {
          flex: 1;
        }

        .student-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 5px 0;
        }

        .student-email {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .student-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .payment-badge {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .payment-badge.online {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .payment-badge.offline {
          background: #fef3c7;
          color: #d97706;
        }

        .join-date {
          font-size: 11px;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        @media (max-width: 768px) {
          .table-responsive {
            font-size: 11px;
          }

          .chart-container {
            height: 300px;
            padding: 20px 15px;
          }

          .summary-cards-container {
            gap: 10px;
          }

          .summary-card {
            padding: 15px;
          }

          .summary-contentt {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .student-item {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
        }
      `}</style>
    </>
  )
}
