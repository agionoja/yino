import { FaStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import avatar from "../assets/landing/Avatar.png";
import avatar1 from "../assets/landing/avatar2.png";

// Sample data
const data = [
  {
    id: "1",
    rate: 5,
    comment:
      "Thanks to the ICT hub, our business has transformed and reached new heights!",
    profileImg: avatar,
    name: "Jeremiah Sunday",
  },
  {
    id: "2",
    rate: 3,
    comment:
      "The training programs offered are top-notch and have significantly improved my skills.",
    profileImg: avatar1,
    name: "Aishat Kabiru",
  },
  {
    id: "3",
    rate: 5,
    comment:
      "The support team is amazing! They helped me every step of the way.",
    profileImg: avatar1,
    name: "Amara Nwankwo",
  },
  {
    id: "4",
    rate: 4,
    comment:
      "Great experience overall. The platform is user-friendly and effective.",
    profileImg: avatar,
    name: " Kola Adeyemi",
  },
  {
    id: "5",
    rate: 5,
    comment:
      "I highly recommend their services. I've seen a huge improvement in my work.",
    profileImg: avatar,
    name: "Chinwe Obi",
  },
];

export default function TestimonialSwiper() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slider, setSlider] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    beforeChange: (current, next) => setCurrentSlide(next),

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="relative w-full bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <Slider ref={(s) => setSlider(s)} {...settings}>
          {data.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg">
                <div className="mb-4 flex justify-center">
                  {Array.from({ length: 5 }, (_, j) => (
                    <FaStar
                      key={j}
                      className={`text-2xl ${
                        j < item.rate ? "text-blue" : "text-gray"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-4 break-words text-[9.5px] font-semibold text-gray-700 md:text-sm">
                  {item.comment}
                </p>
                <div className="flex flex-col items-center">
                  <img
                    src={item.profileImg}
                    alt={`Profile of ${item.name}`}
                    className="mb-2 h-16 w-16 rounded-full"
                  />
                  <p className="text-base font-semibold text-gray-900">
                    {item.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
