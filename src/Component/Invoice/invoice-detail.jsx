"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import OrderInvoice from "./order-invoice"

const InvoiceDetail = () => {
    const { t } = useTranslation()
    const { orderId } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrderDetails = async () => {
        try {
            setLoading(true)
            const response = await fetch(`https://api.basementex.com/api/order/details/${orderId}`)

            if (!response.ok) {
                throw new Error("Failed to fetch order details")
            }

            const data = await response.json()
            setOrderData(data.data)
        } catch (error) {
            console.error("Error fetching order details:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails()
        }
    }, [orderId])

    if (loading) {
        return (
            <div className="col-lg-9 mx-auto">
                <div className="dashboard__content-wrap">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">{t("Loading...")}</span>
                        </div>
                        <p className="mt-2">{t("Loading invoice details...")}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="col-lg-9 mx-auto">
                <div className="dashboard__content-wrap">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">{t("Error")}</h4>
                        <p>
                            {t("Failed to load invoice details")}: {error}
                        </p>
                        <hr />
                        <button className="btn btn-outline-danger" onClick={() => window.history.back()}>
                            {t("Go Back")}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!orderData) {
        return (
            <div className="col-lg-9 mx-auto">
                <div className="dashboard__content-wrap">
                    <div className="alert alert-warning" role="alert">
                        {t("No invoice data found")}
                    </div>
                </div>
            </div>
        )
    }

    return <OrderInvoice orderData={orderData} />
}

export default InvoiceDetail
