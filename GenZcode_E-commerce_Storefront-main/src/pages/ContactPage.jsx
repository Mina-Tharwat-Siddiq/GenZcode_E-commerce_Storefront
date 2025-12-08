import "./ContactPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ContactPage() {
    return (
        <>
            <Header />
            <div className="contact-container">
                <h1 className="contact-title">Contact Us</h1>
                <p className="contact-subtitle">
                    We’d love to hear from you! Please fill out the form below.
                </p>

                <form
                    action="https://formspree.io/f/mdkqdpkw"
                    method="POST"
                    className="contact-form">

                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" name="name" placeholder="Enter your name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="5" placeholder="Write your message"></textarea>
                    </div>

                    <button type="submit" className="btn-submit">Send Message</button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default ContactPage;