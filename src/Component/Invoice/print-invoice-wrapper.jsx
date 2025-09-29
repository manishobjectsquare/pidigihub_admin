"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import OrderInvoice from "./order-invoice"

const PrintInvoiceWrapper = () => {
    const { orderId } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`https://api.basementex.com/api/order/details/${orderId}`)
            const data = await response.json()
            setOrderData(data.data || data)
        } catch (error) {
            console.error("Error fetching order details:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails()
        }
    }, [orderId])

    useEffect(() => {
        // Auto-print when data is loaded
        if (orderData && !loading) {
            setTimeout(() => {
                window.print()
            }, 1000)
        }
    }, [orderData, loading])

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Preparing invoice for printing...</p>
            </div>
        )
    }

    return (
        <div className="print-invoice">
            <style jsx>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-invoice, .print-invoice * {
                        visibility: visible;
                    }
                    .print-invoice {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .d-print-none {
                        display: none !important;
                    }
                }
            `}</style>
            <OrderInvoice orderData={orderData} />
        </div>
    )
}

export default PrintInvoiceWrapper
