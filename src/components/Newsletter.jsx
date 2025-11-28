import { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Subscribing:', email);
        setEmail('');
    };

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
                        <form onSubmit={handleSubmit} className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="newsletter-button">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Newsletter;

