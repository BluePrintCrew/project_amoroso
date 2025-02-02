import React from "react";
import "./Banner.css"; // Banner 전용 CSS
import banner from "../../assets/main_banner.png";
import Slider from "react-slick";

const images = [{ id: 1, src: banner, alt: "배너 이미지 1" }];

const Banner = () => {
  const settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: false,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id} className="slide">
            <img src={image.src} alt={image.alt} className="slide-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default Banner;
