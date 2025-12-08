import { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const buttonClick = (e) => {
        setLoading(true);
    
        setSuccess(true);
        setError(false);
    }

    return (
        <div className="newsletter-section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h3 className="newsletter-title">Join Our Newsletter</h3>
                        <p className="newsletter-description">
                            We love to surprise our subscribers with occasional gifts.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <form method='POST' action="https://formspree.io/f/mdkqdpkw" className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="newsletter-input"
                                required
                                name='email'
                                disabled={loading}
                            />
                            <button type="submit" className="newsletter-button" disabled={loading} onClick={buttonClick}>
                                {loading ? 'Sending...' : 'Get My Coupon'}
                            </button>
                        </form>
                        {success && (
                            <div className="mt-6 p-6 bg-green-50 border-2 border-green-400 text-green-800 rounded-xl text-center">
                                <p className="text-xl font-bold mb-800">Your 20% coupon has been sent!</p>
                                <p className="mt-2 text-lg">
                                    Check your inbox. Your code: <span className="font-black text-2xl text-orange-600">WELCOME20</span>
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-6 bg-red-50 border-2 border-red-400 text-red-800 rounded-xl text-center">
                                Oops! Something went wrong. Please try again.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Newsletter;
