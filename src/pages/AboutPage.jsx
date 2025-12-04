import React from "react";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AboutPage.css";

function AboutPage(){
   return (
      <>
          <Header />
          <div>

              {/* --- Your About Section --- */}
              <section id="story_sec">
                  <div className="story-content-wrapper">
                      <div className="story-text-container">
                          <h1 className="story-title">Our Story</h1>
                          <div className="story-text-content">
                              <p className="story-text">
                                  It all began with a simple idea: What if we could build something meaningful together?
                                  Six aspiring developers—each with different backgrounds, strengths, and dreams—joined the same intensive course. None of them knew that the next six months would change their lives forever.
                              </p>
                              <p className="story-text">
                                  For half a year, they spent long nights solving bugs, debating design choices, learning new tools, and pushing each other forward. What started as a class quickly evolved into a team… and then into a family.
                                  They supported each other through every assignment, every deadline, and every moment of doubt. Together, they discovered what it means to collaborate, to communicate, and to build something bigger than themselves.
                              </p>
                          </div>
                          <button className="story-read-more-btn">READ MORE</button>
                      </div>
                      <div className="story-image-container">
                          <img 
                              id="GENZ"
                              src="img/Genz gold.jpeg"
                              alt="GENZ Logo"
                              className="story-image"
                          />
                      </div>
                  </div>
              </section>

              <section className="container my-5">
                  <h2 className="text-center mb-4 our-team-title" style={{color:"#F1AE60"}}>Our Team</h2>
                  <div className="slider_sec">
                      {(() => {
                          const settings = {
                              dots: true,
                              infinite: true,
                              speed: 600,
                              slidesToShow: 3,
                              slidesToScroll: 3,
                              centerMode: false,
                              autoplay: true,
                              autoplaySpeed: 3000,
                              arrows: false,
                              pauseOnHover: true,
                              responsive: [
                                  { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                                  { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
                              ]
                          };

                          const team = [
                              { name: "Ahmed Abdelhamid", role: "Frontend Dev", img: "img/abelhamieed.jpg" },
                              { name: "Noha Youssef", role: "Frontend Dev", img: "img/noha.jpg" },
                              { name: "Mina Tharwat", role: "Full Stack Dev", img: "img/mina.jpg" },
                              { name: "Fathy Adel", role: "Backend Dev", img: "img/fathy adel.jpeg" },
                              { name: "Kerolos Saad", role: "Backend Dev", img: "img/kerolos.jpg" },
                              { name: "Aezat Khalaf", role: "Backend Dev", img: "img/eazat.jpg" },

                          ];

                          return (
                              <Slider {...settings}>
                                  {team.map((m, i) => (
                                      <div key={i} className="px-3">
                                          <div className="card text-center shadow-sm team-card">
                                              <img 
                                                  src={m.img} 
                                                  className="card-img-top team-img"
                                                  alt={m.name}
                                              />
                                              <div className="card-body">
                                                  <h5 className="card-title">{m.name}</h5>
                                                  <p className="text-muted">{m.role}</p>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </Slider>
                          );
                      })()}
                  </div>
              </section>















              {/* --- Technologies Section --- */}
              <section className="technologies-section">
                  <div className="container">
                      <div className="row text-center g-4">
                          <div className="col-lg-3 col-md-6">
                              <div className="tech-card">
                                  <div className="tech-icon">
                                      <i className="bi bi-lightning-charge-fill"></i>
                                  </div>
                                  <h4 className="tech-title">React & Vite</h4>
                                  <p className="tech-description">Modern frontend stack for fast rendering</p>
                              </div>
                          </div>

                          <div className="col-lg-3 col-md-6">
                              <div className="tech-card tech-card-orange">
                                  <div className="tech-icon">
                                      <i className="bi bi-server"></i>
                                  </div>
                                  <h4 className="tech-title">Node.js Backend</h4>
                                  <p className="tech-description">Scalable API services and server-side logic</p>
                              </div>
                          </div>

                          <div className="col-lg-3 col-md-6">
                              <div className="tech-card">
                                  <div className="tech-icon">
                                      <i className="bi bi-database-fill"></i>
                                  </div>
                                  <h4 className="tech-title">Data Powered</h4>
                                  <p className="tech-description">Supports real-time and persistent data handling</p>
                              </div>
                          </div>

                          <div className="col-lg-3 col-md-6">
                              <div className="tech-card">
                                  <div className="tech-icon">
                                      <i className="bi bi-speedometer2"></i>
                                  </div>
                                  <h4 className="tech-title">Fast & Responsive</h4>
                                  <p className="tech-description">Lightning-fast loading and smooth interactions</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* --- Bottom Features Section --- */}
              <section className="features-section-bottom">
                  <div className="container">
                      <div className="row g-4">
                          <div className="col-lg-4 col-md-6">
                              <div className="feature-item">
                                  <div className="feature-icon-wrapper">
                                      <i className="bi bi-search"></i>
                                  </div>
                                  <h5 className="feature-heading">SEO Optimized</h5>
                                  <p className="feature-text">Built with best practices for search engines</p>
                              </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                              <div className="feature-item">
                                  <div className="feature-icon-wrapper">
                                      <i className="bi bi-broadcast"></i>
                                  </div>
                                  <h5 className="feature-heading">Real-time Updates</h5>
                                  <p className="feature-text">Websockets & API integration for instant data</p>
                              </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                              <div className="feature-item">
                                  <div className="feature-icon-wrapper">
                                      <i className="bi bi-shield-lock-fill"></i>
                                  </div>
                                  <h5 className="feature-heading">Secure & Reliable</h5>
                                  <p className="feature-text">Authentication, authorization, and data protection</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>


          </div>
          <Footer />
        </>
    )
}

export default AboutPage;
