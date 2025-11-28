import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AccountDetailsPage.css';

function AccountDetailsPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        // Load user data from localStorage or API
        const userAuth = localStorage.getItem('user_auth');
        if (userAuth) {
            const user = JSON.parse(userAuth);
            setFormData({
                firstName: user.firstName || user.firstname || '',
                lastName: user.lastName || user.lastname || '',
                email: user.email || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth || '',
            });
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
        
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Save user data
        const userAuth = localStorage.getItem('user_auth');
        if (userAuth) {
            const user = JSON.parse(userAuth);
            const updatedUser = {
                ...user,
                ...formData
            };
            localStorage.setItem('user_auth', JSON.stringify(updatedUser));
        }
        
        toast.success('Account details updated successfully');
    };

    return (
        <div className="account-details-page">
            <h2 className="page-heading">Account Detail</h2>
            
            <form onSubmit={handleSubmit} className="account-details-form">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default AccountDetailsPage;

