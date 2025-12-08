import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './AccountDetailsPage.css';
import api from '../../api';
import axios from 'axios';
function AccountDetailsPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
    });

    const [userId, setUserId] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const getUser = async () => {
        try {
            const res = await api.get('/users/me');
            const userData = res.data.user;
            //Set Form Fields

            setFormData({
                fullName: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
            });
            // Set UserId
            setUserId(userData._id);
            setProfileImage(userData.profileImage || 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png');
        } catch (e) {
            toast.error("Failed To Get User Data");
        }
    };

    useEffect(() => {
        // Load user data from API
        getUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
        setImageUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ecommerce-profile'); 

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dbzkgyrde/image/upload',
                formData
            );

            setProfileImage(response.data.secure_url);
            // Save To Mongo DB
            await api.put(`/users/${userId}`, { profileImage: response.data.secure_url });
            toast.success("The image has been uploaded successfully");
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error("Failed To Upload Image.");
            setProfileImage('https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png');
        } finally {
            setImageUploading(false);
            URL.revokeObjectURL(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Save user data
        try {
            const updateData = {
                name: formData.fullName,
                phone: formData.phone || null,
                profileImage: profileImage,
                dateOfBirth: formData.dateOfBirth || null,
            };

            if (profileImage && !profileImage.includes('blob:')) {
                updateData.profileImage = profileImage;
            }

            await api.put(`/users/${userId}`, updateData);

            toast.success('Account details updated successfully');
            

        } catch (err) {
            console.error(err);
            toast.error("An error occurred, try again!");
        }
    };

    return (
        
        <div className="account-details-page">
            <ToastContainer
                position="top-center"     
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}              
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <h2 className="page-heading">Account Detail</h2>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <label htmlFor="profileImageInput" style={{ cursor: 'pointer' }}>
                    <img
                        src={profileImage || '/images/default-avatar.png'}
                        alt="Profile"
                        style={{
                            width: '130px',
                            height: '130px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid #f0a500',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}
                    />
                    {imageUploading && <p style={{ color: '#f0a500' }}>Uploading...</p>}
                </label>
                <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <br />
                <small style={{ color: '#888' }}>Click on the image to Change it</small>
            </div>
            <form onSubmit={handleSubmit} className="account-details-form">
                <div className="row">
                    <div className="col-md-6">
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
                    </div>
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
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

