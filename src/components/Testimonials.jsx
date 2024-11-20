import Img2 from "../images/testimonials/avatar.png";
import Line from "../images/testimonials/Line.png";
import BackgroundImage from "../images/testimonials/OBJECTS2.png";
import React, { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Martin Doe",
    message:
      "Lorem ipsum dolor sit amet consectetur. Ultrices at sed netus nulla pellentesque vel sed. Dui gravida in etiam tempor ac et diam arcu. Nunc morbi pretium mus auctor dui pharetra eget. Id volutpat egestas duis suspendisse neque amet cursus. Ante faucibus morbi quis ac. Nunc scelerisque non posuere massa sed pretium sed ut cras. Est at consectetur elementum lobortis amet rutrum. Posuere eu nunc mattis mauris et elit pretium pellentesque. Integer volutpat facilisis ut donec orci vitae mi. Tellus pellentesque varius aliquam enim. Habitant odio ultrices lorem bibendum aliquet.",
    role: "Driver",
    image: Img2,
  },
  {
    name: "Jane Smith",
    message:
      "The project was completed on time and exceeded expectations. Fantastic work!",
    role: "Driver",
    image: Img2,
  },
  {
    name: "Michael Brown",
    message: "Very professional team, the quality of work was top-notch.",
    role: "Driver",
    image: Img2,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide to next testimonial
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Handle manual slide via dots
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative h-fit  md:px-96 flex items-center justify-center"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for background darkening */}
      <div className="absolute inset-0 bg-[#031E47] opacity-95"></div>

      <div className="flex flex-col items-center p-8 justify-center w-full ">
        <h1 className="relative md:my-8 text-[#FABD05] font-semibold md:text-7xl text-4xl">
          Testimonials
        </h1>
        <div className="relative w-full max-w-3xl overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-none w-full  ">
                <div className="flex flex-col items-center justify-center  h-full text-center  md:text-left">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-40 h-40 rounded-full text-white md:mb-4 md:mr-6"
                  />

                  <p className="text-xl text-gray-300  text-center ">
                    {testimonial.message}
                  </p>
                  <img className="w-72 mt-8 h-[1.5px]" src={Line} />

                  <p className="mt-2 text:xl text-white md:text-2xl font-bold">
                    {testimonial.name}
                  </p>
                  <p className="text-base text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots for navigation */}
        <div className="flex relative justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-gray-600" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
