import React from 'react';

const OrderInvoice = () => {
    // Mock data for order
    const order = {
        id: 1,
        invoice_id: 'INV-2023-001',
        created_at: '2023-05-15T10:30:00Z',
        payment_method: 'Credit Card',
        payment_status: 'Paid',
        conversion_rate: 1,
        payable_currency: 'USD',
        coupon_discount_amount: 10,
        gateway_charge: 2.5,
        user: {
            name: 'John Doe',
            phone: '+1234567890',
            email: 'john.doe@example.com',
            address: '123 Main St, Anytown, USA'
        },
        orderItems: [
            {
                id: 101,
                price: 49.99,
                course: {
                    title: 'Web Development Fundamentals',
                    instructor: {
                        name: 'Sarah Johnson',
                        email: 'sarah.johnson@example.com'
                    }
                }
            },
            {
                id: 102,
                price: 39.99,
                course: {
                    title: 'JavaScript Masterclass',
                    instructor: {
                        name: 'Michael Chen',
                        email: 'michael.chen@example.com'
                    }
                }
            }
        ]
    };

    // Format date helper function


    // Calculate order totals
    const subTotal = order.orderItems.reduce((sum, item) => sum + item.price, 0);
    const discount = order.coupon_discount_amount || 0;
    const gatewayCharge = order.gateway_charge || 0;
    const gatewayPercentage = gatewayCharge > 0 ? (gatewayCharge / (subTotal - discount)) * 100 : 0;
    const total = (subTotal - discount + gatewayCharge) * order.conversion_rate;

    return (
        <div className="col-lg-9 mx-auto">
            <div className="dashboard__content-wrap">
                <div className="dashboard__content-title">
                    <h4 className="title">Order History</h4>
                </div>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="invoice">
                            <div className="invoice-print">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="invoice-title">
                                                    <h2 className="h5 fw-bold">Invoice</h2>
                                                    <p className="invoice-number mb-1">Order #{order.invoice_id}</p>
                                                    <p><strong>Order Date:</strong>29 April 2025</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <p>
                                                    <strong>Billed To:</strong><br />
                                                    {order.user.name}<br />
                                                    <strong>Phone:</strong> {order.user.phone}<br />
                                                    <strong>Email:</strong> {order.user.email}<br />
                                                    <strong>Address:</strong> {order.user.address}
                                                </p>
                                            </div>
                                            <div className="col-md-4">
                                                <p><strong>Payment Method:</strong> {order.payment_method}</p>
                                                <p><strong>Payment Status:</strong> {order.payment_status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-12">
                                        <h5 className="section-title">Order Summary</h5>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Item</th>
                                                        <th>Instructor</th>
                                                        <th className="text-center">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.orderItems.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.course.title}</td>
                                                            <td>
                                                                {item.course.instructor.name}<br />
                                                                {item.course.instructor.email}
                                                            </td>
                                                            <td className="text-center">
                                                                {(item.price * order.conversion_rate).toFixed(2)} {order.payable_currency}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-md-8"></div>
                                            <div className="col-md-4">
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Subtotal</strong></td>
                                                            <td className="text-end">
                                                                {(subTotal * order.conversion_rate).toFixed(2)} {order.payable_currency}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Discount</strong></td>
                                                            <td className="text-end">
                                                                {(discount * order.conversion_rate).toFixed(2)} {order.payable_currency}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <strong>Gateway Charge ({gatewayPercentage.toFixed(0)}%)</strong>
                                                            </td>
                                                            <td className="text-end">
                                                                {(gatewayCharge * order.conversion_rate).toFixed(2)} {order.payable_currency}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-top">
                                                            <td><strong>Total</strong></td>
                                                            <td className="text-end fw-bold">
                                                                {total.toFixed(2)} {order.payable_currency}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div className="text-end">
                                    <a
                                        href={`/student/order/print-invoice/${order.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-warning"
                                    >
                                        <i className="fas fa-print"></i> Print
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInvoice;