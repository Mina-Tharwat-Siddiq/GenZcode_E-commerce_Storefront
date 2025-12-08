import React, { useEffect, useState } from 'react';
import { Card, ProgressBar, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import api from '../../api';
import { Link } from 'react-router-dom';

function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/orders/dashboard');
                setData(res.data);
                setLoading(false);
            } catch (e) {
                alert('Failed to load dashboard');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><Spinner animation="border" variant="warning" /></div>;

    const {
        totalSalesThisMonth = 0,
        totalOrdersThisMonth = 0,
        totalCustomersThisMonth = 0,
        monthlyGoal = 1000,
        ordersLeftToGoal = 0,
        recentOrders = [],
        bestSelling = []
    } = data;

    const progress = ((monthlyGoal - ordersLeftToGoal) / monthlyGoal) * 100;

    return (
        <div style={{ minHeight: '100vh' }} className="p-4">

            {/* Top 3 Cards */}
            <div className="row g-4 mb-4">
                {/* Total Sales */}
                <div className="col-lg-4 col-md-6">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Total Sales</p>
                                    <h3 className="mb-0">${totalSalesThisMonth.toLocaleString()}</h3>
                                    <small className="text-success">THIS MONTH</small>
                                </div>
                                <div>
                                    {/* Simple bar chart */}
                                    <svg width="100" height="50">
                                        {[15, 20, 25, 22, 30, 35, 32, 38, 45, 40, 48, 50].map((h, i) => (
                                            <rect key={i} x={i * 8} y={50 - h} width="6" height={h} fill="#FFB74D" rx="2" />
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Customers */}
                <div className="col-lg-4 col-md-6">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Customers</p>
                                    <h3 className="mb-0">{totalCustomersThisMonth.toLocaleString()}</h3>
                                    <small className="text-primary">THIS MONTH</small>
                                </div>
                                {/* Line chart */}
                                <svg width="100" height="50">
                                    <polyline fill="none" stroke="#FFB74D" strokeWidth="3"
                                        points="0,35 10,25 20,30 30,20 40,28 50,18 60,25 70,15 80,22 90,10 100,18" />
                                </svg>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Orders */}
                <div className="col-lg-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <p className="text-muted small mb-1">Orders</p>
                            <div className="d-flex justify-content-between align-items-end">
                                <div>
                                    <h3 className="mb-0">{totalOrdersThisMonth}</h3>
                                    <small>MONTHLY GOAL: {monthlyGoal}</small>
                                </div>
                                <div className="w-100 mt-2">
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span>{ordersLeftToGoal} Left</span>
                                    </div>
                                    <ProgressBar now={progress} style={{ height: '10px' }} className="bg-light" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="row g-4">
                {/* Best Selling */}
                <div className="col-lg-6">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex flex-column">
                            <h6 className="text-muted">Best Selling <span className="text-dark">THIS MONTH</span></h6>

                            <div className="mt-3 mb-4">
                                <h5 className="text-center mb-3">${totalSalesThisMonth.toLocaleString()} — Total Sales</h5>
                                {bestSelling.slice(0, 4).map((item, i) => (
                                    <div key={i} className="d-flex justify-content-between small mb-2">
                                        <span>{item.name}</span>
                                        <span className="text-muted">${item.sales.toLocaleString()} Sales</span>
                                    </div>
                                ))}
                            </div>

                            {/* Donut Chart */}
                            <div className="mt-auto text-center">
                                <svg width="120" height="120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E0E0E0" strokeWidth="18" />
                                    {bestSelling.slice(0, 4).map((item, i) => {
                                        const percent = (item.sales / totalSalesThisMonth) * 100;
                                        const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'];
                                        let prev = 0;
                                        for (let j = 0; j < i; j++) prev += (bestSelling[j].sales / totalSalesThisMonth) * 314;
                                        const dash = (percent / 100) * 314;
                                        return (
                                            <circle key={i}
                                                cx="60" cy="60" r="50"
                                                fill="none"
                                                stroke={colors[i]}
                                                strokeWidth="18"
                                                strokeDasharray={`${dash} 314`}
                                                strokeDashoffset={-prev}
                                                transform="rotate(-90 60 60)"
                                            />
                                        );
                                    })}
                                </svg>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Recent Orders */}
                <div className="col-lg-6">
                    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-4">
                            <h5 className="mb-0 fw-semibold text-dark">Recent Orders</h5>
                            <Link
                                to="/adminDashboard/orders"
                                className="text-warning text-decoration-none fw-medium small d-flex align-items-center"
                            >
                                View all
                            </Link>
                        </Card.Header>

                        <Card.Body className="pt-2">
                            {/* Titles */}
                            <div className="row text-muted small fw-medium mb-2 px-3">
                                <div className="col-4">Customer</div>
                                <div className="col-3 text-center">Date</div>
                                <div className="col-3 text-center">Total</div>
                                <div className="col-2 text-end">Status</div>
                            </div>

                            {/* Minu */}
                            <div className="list-group list-group-flush">
                                {recentOrders.slice(0, 6).map((order, index) => (
                                    <div
                                        key={order.id}
                                        className="list-group-item px-3 py-3 border-0"
                                        style={{ borderBottom: '1px solid #FFE0B2' }} 
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-4">
                                                <div className="fw-semibold text-dark">{order.customerName}</div>
                                                <div className="text-muted small">#{order.id.toString().slice(-6)}</div>
                                            </div>
                                            <div className="col-3 text-center text-muted small">
                                                {new Date(order.date).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </div>
                                            <div className="col-3 text-center fw-bold text-dark">
                                                ${order.total.toFixed(2)}
                                            </div>
                                            <div className="col-2 text-end">
                                                <span className={`badge rounded-pill px-3 py-2 fw-medium ${order.status === 'delivered' ? 'bg-success text-white' :
                                                        order.status === 'processing' ? 'bg-warning text-dark' :
                                                            order.status === 'pending' ? 'bg-secondary text-white' :
                                                                order.status === 'shipped' ? 'bg-info text-white' :
                                                                    'bg-light text-dark'
                                                    }`}>
                                                    {order.status === 'delivered' ? 'Completed' :
                                                        order.status === 'processing' ? 'Processing' :
                                                            order.status === 'pending' ? 'Pending' :
                                                                order.status === 'shipped' ? 'Shipped' :
                                                                    order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {recentOrders.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        No orders yet
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;