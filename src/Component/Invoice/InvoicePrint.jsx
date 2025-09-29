"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"

const InvoicePrint = () => {
  const { invoiceId } = useParams()
  const [searchParams] = useSearchParams()
  const [completeData, setCompleteData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Default settings - you can fetch these from your API
  const setting = {
    logo: "/logo.png",
    app_name: "Teachera",
    contact_message_receiver_mail: "info@teachera.com",
    site_address: "123 Education Street, Learning City, ED 12345",
  }

  useEffect(() => {
    // Get complete data from URL params
    const urlData = searchParams.get("data")
    if (urlData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(urlData))
        setCompleteData(parsedData)
        console.log("Complete API Data Available:", parsedData)
      } catch (error) {
        console.error("Error parsing invoice data:", error)
        setCompleteData(createMockData())
      }
    } else {
      setCompleteData(createMockData())
    }
    setLoading(false)
  }, [invoiceId, searchParams])

  const createMockData = () => ({
    selectedItem: {
      invoice: invoiceId || "INV-2023-001",
      purchaseId: "PUR-001",
      paid: 89.98,
      payment_Gateway: "Credit Card",
      payment_Status: "paid",
      Status: "completed",
      userName: "John Doe",
      courseTitle: "Sample Course",
      createdAt: new Date().toISOString(),
    },
    fullApiResponse: {
      success: true,
      message: "Sample data",
      data: [],
    },
    courseList: [],
    metadata: {
      totalRecords: 0,
      apiMessage: "Sample data",
      apiSuccess: true,
      generatedAt: new Date().toISOString(),
    },
  })

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Auto print on load
  useEffect(() => {
    if (!loading && completeData) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [loading, completeData])

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <div>Loading invoice...</div>
      </div>
    )
  }

  if (!completeData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <div>Invoice not found</div>
      </div>
    )
  }

  // Extract data from the complete data structure
  const invoiceData = completeData.selectedItem
  const apiResponse = completeData.fullApiResponse
  const courseList = completeData.courseList
  const metadata = completeData.metadata

  // Get course details from course list if available
  const getCourseDetails = (courseId) => {
    return courseList.find((course) => course._id === courseId)
  }

  const courseDetails = getCourseDetails(invoiceData.course_Id)

  // Calculate totals
  const subTotal = Number.parseFloat(invoiceData.paid || 0)
  const discount = 0 // You can add discount logic here
  const total = subTotal

  return (
    <div
      className="invoice_area main-sec mt-5"
      style={{
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
      }}
    >
      {/* Debug info - remove in production */}
      <div style={{ display: "none" }}>
        <h3>Available Data:</h3>
        <p>Selected Item: {JSON.stringify(invoiceData, null, 2)}</p>
        <p>API Response: {JSON.stringify(apiResponse, null, 2)}</p>
        <p>Course List: {JSON.stringify(courseList, null, 2)}</p>
        <p>Metadata: {JSON.stringify(metadata, null, 2)}</p>
      </div>

      <div
        className="invoice_header"
        style={{
          background: "#f3f2f2",
          padding: "30px",
        }}
      >
        <div className="table-responsive">
          <table
            className="table"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <tbody style={{ width: "100%" }}>
              <tr
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <td className="left" style={{ width: "49%" }}>
                  <a style={{ display: "block", width: "160px" }}>
                    <img src={setting.logo || "/placeholder.svg"} alt="Logo" style={{ maxWidth: "100%" }} />
                  </a>
                </td>
                <td className="right" style={{ width: "49%" }}>
                  <h2
                    style={{
                      textTransform: "uppercase",
                      fontSize: "28px",
                      fontWeight: 600,
                      lineHeight: "initial",
                      marginBottom: "10px",
                      textAlign: "right",
                      color: "#05092B",
                    }}
                  >
                    Invoice
                  </h2>
                  <h5
                    style={{
                      fontSize: "16px",
                      textAlign: "right",
                      color: "#05092B",
                    }}
                  >
                    Invoice: {invoiceData.invoice}
                  </h5>
                  <br />
                  <h5
                    style={{
                      fontSize: "16px",
                      textAlign: "right",
                      color: "#05092B",
                    }}
                  >
                    Date: {formatDate(invoiceData.createdAt)}
                  </h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="invoice_billing_info" style={{ padding: "30px" }}>
        <div className="table-responsive">
          <table
            className="table"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <tbody style={{ width: "100%" }}>
              <tr
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <td style={{ width: "49%" }}>
                  <h5
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                      marginBottom: "10px",
                      color: "#05092B",
                    }}
                  >
                    Billed To
                  </h5>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    {invoiceData.userName}
                  </p>

                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    Purchase ID: {invoiceData.purchaseId}
                  </p>
                </td>
                <td style={{ width: "49%" }}>
                  <h5
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                      marginBottom: "10px",
                      color: "#05092B",
                    }}
                  >
                    Billed From
                  </h5>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    {setting.app_name}
                  </p>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    {setting.contact_message_receiver_mail}
                  </p>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    {setting.site_address}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="invoice_billing_order" style={{ padding: "30px" }}>
        <div className="table-responsive">
          <table
            className="table"
            style={{
              border: "1px solid rgb(238, 238, 238)",
              width: "100%",
            }}
          >
            <thead style={{ width: "100%" }}>
              <tr
                style={{
                  background: "#f3f2f2",
                  width: "100%",
                  display: "flex",
                }}
              >
                <th
                  style={{
                    padding: "10px 20px",
                    borderRight: "1px solid rgb(238, 238, 238)",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "10%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  No.
                </th>
                <th
                  style={{
                    padding: "10px 20px",
                    borderRight: "1px solid rgb(238, 238, 238)",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "40%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  Course
                </th>
                <th
                  style={{
                    padding: "10px 20px",
                    borderRight: "1px solid rgb(238, 238, 238)",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "25%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  Course Name
                </th>
                <th
                  style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "25%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody style={{ width: "100%" }}>
              <tr
                style={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <td
                  style={{
                    padding: "10px 20px",
                    borderRight: "1px solid rgb(238, 238, 238)",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "10%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  1
                </td>
                <td
                  style={{
                    padding: "10px 20px",
                    borderRight: "1px solid rgb(238, 238, 238)",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "40%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  {invoiceData.courseTitle || courseDetails?.title || "Course"}
                  {courseDetails && (
                    <>
                      <br />
                      <small>Instructor: {courseDetails.instructorDetails?.name}</small>
                    </>
                  )}
                </td>
                <td
                  style={{
                    padding: "10px 20px",
                    borderRight: "1px solid rgb(238, 238, 238)",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "25%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  {invoiceData?.courseTitle}
                </td>
                <td
                  style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid rgb(238, 238, 238)",
                    width: "25%",
                    color: "#05092B",
                    textAlign: "left",
                  }}
                >
                  ${Number.parseFloat(invoiceData.paid || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="invoice_billing_info" style={{ padding: "30px" }}>
        <div className="table-responsive">
          <table
            className="table"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <tbody style={{ width: "100%" }}>
              <tr
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <td className="left" style={{ width: "49%" }}>
                  <h5
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                      marginBottom: "10px",
                      color: "#05092B",
                    }}
                  >
                    Payment Details
                  </h5>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    <b>Payment Method:</b> {invoiceData.payment_Gateway}
                  </p>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    <b>Payment Status:</b> {invoiceData.payment_Status || invoiceData.Status}
                  </p>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >

                  </p>
                </td>
                <td className="right" style={{ width: "49%" }}>
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "10px",
                      textAlign: "right",
                    }}
                  >
                    Sub Total:
                    <span
                      style={{
                        display: "inline-block",
                        width: "150px",
                        textAlign: "right",
                      }}
                    >
                      ${subTotal.toFixed(2)}
                    </span>
                  </p>
                  {discount > 0 && (
                    <p
                      style={{
                        color: "#545353",
                        fontWeight: 400,
                        fontSize: "16px",
                        marginTop: "10px",
                        textAlign: "right",
                      }}
                    >
                      Discount:
                      <span
                        style={{
                          display: "inline-block",
                          width: "150px",
                          textAlign: "right",
                        }}
                      >
                        ${discount.toFixed(2)}
                      </span>
                    </p>
                  )}
                  <p
                    style={{
                      color: "#545353",
                      fontWeight: 600,
                      fontSize: "18px",
                      marginTop: "15px",
                      textAlign: "right",
                      borderTop: "1px solid #eee",
                      paddingTop: "10px",
                    }}
                  >
                    Total Paid:
                    <span
                      style={{
                        display: "inline-block",
                        width: "150px",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "20px",
          borderTop: "1px solid #eee",
          marginTop: "20px",
          color: "#666",
        }}
      >
        <p>Thank you for your purchase!</p>
        <small>This is a computer generated invoice.</small>
        <br />
        <small>Generated at: {formatDate(metadata.generatedAt)}</small>
      </div>
    </div>
  )
}

export default InvoicePrint
