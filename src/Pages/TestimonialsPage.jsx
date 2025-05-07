import React from "react";
import image from "../images/testimonials/avatar.png";
import Footer from "../components/Footer";
import BackgroundImage1 from "../images/howitworks/bgHow.png";

// Testimonial data
const testimonials = [
  {
    name: "Marc Köhlbrugge",
    handle: "@marckohlbrugge",
    text: `Tweeting more with @typefully these days.\n\n🧘‍♂️ Distraction-free\n✍🏻 Write-only Twitter\n📑 Effortless threads\n📊 Actionable metrics\n\nI recommend giving it a shot.`,
    avatar: "/path-to-avatar1.jpg", // Replace with actual avatar paths
    bgColor: "bg-white",
  },
  {
    name: "Santiago",
    handle: "@svpino",
    text: `For 24 months, I tried almost a dozen Twitter scheduling tools.\n\nThen I found @typefully, and I've been using it for seven months straight.\n\nWhen it comes down to the experience of scheduling and long-form content writing, Typefully is in a league of its own.`,
    avatar: "/path-to-avatar2.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Jurre Houtkamp",
    handle: "@jurrehoutkamp",
    text: `Typefully is fantastic and way too cheap for what you get.\n\nWe've tried many alternatives @framer but nothing beats it. If you're still tweeting from Twitter you're wasting time.`,
    avatar: "/path-to-avatar3.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Luca Rossi",
    handle: "@lucaronin",
    text: `After trying literally all the major Twitter scheduling tools, I settled with @typefully.\n\nKiller feature to me is the native image editor — unique and super useful 🙏`,
    avatar: "/path-to-avatar4.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Visual Theory",
    handle: "@visualtheory_",
    text: `Really impressed by the way @typefully has simplified my Twitter writing + scheduling/publishing experience.\n\nBeautiful user experience.\n0 friction.\n\nSimplicity is the ultimate sophistication.`,
    avatar: "/path-to-avatar5.jpg",
    bgColor: "bg-white",
  },
  {
    name: "Naitik Mehta",
    handle: "@heyNaitik",
    text: `I've reached 600K+ impressions since I started writing online 6 months ago w/ @typefully 🤯\n\nShoutout to the team for building a beautiful writing tool with thought, care, and good design.\n\n👉 Clean UX/design\n👉 Mobile-friendly\n👉 Keyboard shortcuts\n👉 Rarely see any bugs`,
    avatar: "/path-to-avatar6.jpg",
    bgColor: "bg-white",
  },
  {
    name: "DHH",
    handle: "@dhh",
    text: `This is my new go-to writing environment for Twitter threads.\n\nThey've built something wonderfully simple and distraction free with Typefully.`,
    avatar: "/path-to-avatar7.jpg",
    bgColor: "bg-white",
  },
  {
    name: "daws.eth",
    handle: "@DawsonBotsford",
    text: `Impressed with @typefully. It's the editor you wish Twitter had.\n\nSaving multiple drafts, re-ordering tweets in a thread, and moving attached images around is EASY.`,
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
      <Footer />
    </div>
  );
};

export default TestimonialsGrid;
