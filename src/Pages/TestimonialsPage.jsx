import React from "react";
import image from "../images/testimonials/avatar.png";
import Footer from "../components/Footer";
import BackgroundImage1 from "../images/howitworks/bgHow.png";

// Testimonial data
const testimonials = [
  {
    name: "Aisha Mohammed",
    handle: "@aishamohammed",
    text: `Car rental in Addis Ababa has never been this easy! Found the perfect car for my trip through this platform. Smooth process, great prices. Highly recommend!`,
    avatar: "/path-to-avatar1.jpg", // Replace with actual avatar paths
    bgColor: "bg-white",
  },
  {
    name: "Kebede Demissie",
    handle: "@kebeded",
    text: `I've used many car rental services in Ethiopia, but this one stands out. Their selection is diverse, and the booking experience is seamless. A real time-saver for my business trips.`,
    avatar: "/path-to-avatar2.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Tirunesh Bekele",
    handle: "@tiruneshB",
    text: `Fantastic experience! Rented a car for a family vacation to Bahir Dar. The car was clean, well-maintained, and the customer service was excellent. Will definitely use again.`,
    avatar: "/path-to-avatar3.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Fitsum Abera",
    handle: "@fitsuma",
    text: `Needed a reliable car for a week in Ethiopia, and this service delivered. The pickup and drop-off were convenient, and the communication was top-notch.`,
    avatar: "/path-to-avatar4.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Mekonnen Tesfaye",
    handle: "@mekonnent",
    text: `Impressed by how simple and efficient the whole rental process is. From Browse cars to completing the booking, everything was straightforward. A true game-changer for car rentals here.`,
    avatar: "/path-to-avatar5.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Sara Gebre",
    handle: "@sarag",
    text: `Found the perfect car for my needs at a very competitive price. The transparency in pricing and the wide range of vehicles made my decision easy. Definitely my go-to for car rentals now.`,
    avatar: "/path-to-avatar6.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Yonas Getachew",
    handle: "@yonasg",
    text: `This platform makes renting a car in Ethiopia stress-free. The detailed listings and user reviews helped me choose with confidence. A truly reliable service.`,
    avatar: "/path-to-avatar7.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Lelise Kebede",
    handle: "@lelisek",
    text: `I was hesitant about online car rentals, but this changed my mind. The entire process was seamless, and the car was exactly as described. Excellent service from start to finish!`,
    avatar: "/path-to-avatar8.jpg",
    bgColor: "bg-white",
  },
];

// Card component to render each testimonial
const Card = ({ testimonial }) => (
  <div
    className={`shadow-lg p-5 max-w-lg text-sm rounded-xl ${testimonial.bgColor} space-y-3 transition-all ease-in-out hover:shadow-2xl`}
  >
    <div className="flex items-center space-x-3">
      <img
        src={image}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <h3 className="font-bold text-gray-900">
          {testimonial.name}{" "}
          <span className="text-blue-500 font-normal">
            {testimonial.handle}
          </span>
        </h3>
      </div>
    </div>
    <p className="text-gray-700 whitespace-pre-line">
      {highlightHandle(testimonial.text)}
    </p>
  </div>
);

// Helper function to highlight @ handles in the testimonial text
const highlightHandle = (text) => {
  const words = text.split(" ");
  return words.map((word, index) => {
    if (word.startsWith("@")) {
      return (
        <span key={index} className="text-blue-500">
          {word}{" "}
        </span>
      );
    }
    return word + " ";
  });
};

// Main TestimonialsGrid component
const TestimonialsGrid = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage1})`,
      }}
      className=" flex flex-col overflow-hidden bg-auto  "
    >
      <h2 className="text-center text-2xl my-28 md:mt-52 md:text-7xl  font-semibold text-[#00173C] mb-4">
        What Our Customers Say
      </h2>
      <div className="min-h-screen bg-white md:mb-40 flex justify-center items-center py-8">
        <div className="flex flex-wrap  gap-6 max-w-8xl justify-center items-center px-10 md:px-52">
          {testimonials.map((testimonial, index) => (
            <Card key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>{" "}
      {/* <Footer /> */}
    </div>
  );
};

export default TestimonialsGrid;
