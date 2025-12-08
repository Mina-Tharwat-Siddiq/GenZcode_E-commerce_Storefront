import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AddressPage.css';

function AddressPage() {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
    });

    useEffect(() => {
        const savedAddresses = localStorage.getItem('user_addresses');
        if (savedAddresses) {
            setAddresses(JSON.parse(savedAddresses));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingIndex !== null) {
            // Update existing address
            const updated = [...addresses];
            updated[editingIndex] = formData;
            setAddresses(updated);
            localStorage.setItem('user_addresses', JSON.stringify(updated));
            toast.success('Address updated successfully');
        } else {
            // Add new address
            const updated = [...addresses, formData];
            setAddresses(updated);
            localStorage.setItem('user_addresses', JSON.stringify(updated));
            toast.success('Address added successfully');
        }
        
        setShowForm(false);
        setEditingIndex(null);
        setFormData({
            fullName: '',
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phone: '',
        });
    };

    const handleEdit = (index) => {
        setFormData(addresses[index]);
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        const updated = addresses.filter((_, i) => i !== index);
        setAddresses(updated);
        localStorage.setItem('user_addresses', JSON.stringify(updated));
        toast.success('Address deleted successfully');
    };

    return (
        <div className="address-page">
            <div className="address-header">
                <h2 className="page-heading">Address</h2>
                <button 
                    className="btn btn-primary add-address-btn"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingIndex(null);
                        setFormData({
                            fullName: '',
                            streetAddress: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: '',
                            phone: '',
                        });
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add New Address'}
                </button>
            </div>

            {showForm && (
                <div className="address-form-container">
                    <form onSubmit={handleSubmit} className="address-form">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Street Address *</label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Zip Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingIndex !== null ? 'Update Address' : 'Save Address'}
                        </button>
                    </form>
                </div>
            )}

            {addresses.length === 0 && !showForm ? (
                <div className="empty-addresses">
                    <i className="bi bi-geo-alt"></i>
                    <p>You have no saved addresses</p>
                    <p className="sub-text">Add an address to make checkout faster</p>
                </div>
            ) : (
                <div className="addresses-list">
                    {addresses.map((address, index) => (
                        <div key={index} className="address-card">
                            <div className="address-info">
                                <h5>{address.fullName}</h5>
                                <p>{address.streetAddress}</p>
                                <p>{address.city}, {address.state} {address.zipCode}</p>
                                <p>{address.country}</p>
                                <p>Phone: {address.phone}</p>
                            </div>
                            <div className="address-actions">
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEdit(index)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDelete(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddressPage;

