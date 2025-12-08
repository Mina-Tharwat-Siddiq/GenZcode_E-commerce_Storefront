import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import model1 from '/images/sliderImg2.png';
import model2 from '/images/discount-vector.png';
import { Link } from 'react-router-dom';

const Slider = () => {
    return (
        <div className="hero-slider position-relative">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={1200}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'swiper-custom-bullet',
                    bulletActiveClass: 'swiper-custom-bullet-active',
                }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                className="h-screen"
            >

                {/* Slide 1 */}
                <SwiperSlide>
                    <div className="bg-gradient-to-br from-amber-300 to-orange-400 h-full flex items-center">
                        <div className="container">
                            <div className="row align-items-center g-5">
                                <div className="col-lg-6 text-center text-lg-start">
                                    <h1 className="display-3 display-md-2 fw-bold text-dark mb-4">
                                        Fresh Arrivals Online
                                    </h1>
                                    <p className="lead fs-3 text-dark mb-5">
                                        Discover the latest collection today before it's gone!
                                    </p>
                                    <Link to="/search" className="btn btn-dark btn-lg px-5 py-3 rounded-pill fs-5">
                                        Check out the collection →
                                    </Link>
                                </div>
                                <div className="col-lg-6 text-center">
                                    <img
                                        src={model1}
                                        alt="Tay Son Brotherhood"
                                        className="img-fluid rounded-5"
                                        style={{ maxHeight: '680px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                    <div className="bg-gradient-to-br from-rose-300 to-pink-400 h-full flex items-center">
                        <div className="container">
                            <div className="row align-items-center g-5 flex-lg-row-reverse">
                                <div className="col-lg-6 text-center text-lg-end">
                                    <h1 className="display-3 display-md-2 fw-bold text-dark mb-4">
                                        Discount up to 50%
                                    </h1>
                                    <p className="lead fs-3 text-dark mb-5">
                                        On all new items for 72 hours only!
                                    </p>
                                    <Link to="/search" className="btn btn-dark btn-lg px-5 py-3 rounded-pill fs-5">
                                        Shop now →
                                    </Link>
                                </div>
                                <div className="col-lg-6 text-center">
                                    <img
                                        src={model2}
                                        alt="New Collection"
                                        className="img-fluid rounded-5 "
                                        style={{ maxHeight: '680px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>


            </Swiper>

            {/* Custom Pagination & Navigation */}
            <div className="custom-pagination position-absolute bottom-0 start-50 translate-middle-x mb-5 z-10 d-flex gap-2"></div>

            <div className="swiper-button-prev-custom text-dark fs-1 position-absolute top-50 start-0 translate-middle-y z-10 ms-4"></div>
            <div className="swiper-button-next-custom text-dark fs-1 position-absolute top-50 end-0 translate-middle-y z-10 me-4"></div>

            <style jsx>{`
        .swiper-custom-bullet {
            width: 12px;
            height: 12px;
            background: white;
            opacity: 0.5;
            border-radius: 50%;
            transition: all 0.3s;
        }
        .swiper-custom-bullet-active {
            opacity: 1;
            width: 40px;
            border-radius: 20px;
            background: white;
        }
        `}</style>
        </div>
    );
};

export default Slider;