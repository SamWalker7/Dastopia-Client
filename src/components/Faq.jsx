import React, { useState } from "react";

// Questions and answers data
const faqData = [
  {
    question: "How do I rent a car?",
    answer:
      "Choose a car, select your dates, and confirm your booking online or through our app.",
  },
  {
    question: "What do I need to rent a car?",
    answer: "You need a valid ID, a driver's license, and a payment method.",
  },
  {
    question: "Can I cancel or change my booking?",
    answer:
      "Yes, you can cancel or update your booking from your account, depending on the policy.",
  },
  // {
  //   question: "Is insurance included?",
  //   answer: "Yes, basic insurance is included with every rental.",
  // },
  {
    question: "How can I list my car?",
    answer:
      "Sign up, add your car details, and publish your listing to start earning.",
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to the second question

  // Function to change the selected question
  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-semibold text-center mt-16 mb-32">
        Frequently Asked Questions
      </h2>

      <div className="flex items-center justify-center flex-col lg:flex-row lg:space-x-10">
        {/* Left side: Questions list */}
        <div className="w-full shadow-md shadow-blue-50 text-sm rounded-md lg:w-1/2 space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`cursor-pointer justify-between  p-4 flex  transition-all ease-in-out duration-300 ${
                activeIndex === index
                  ? "bg-blue-50 text-black font-medium"
                  : " text-gray-700"
              } hover:bg-blue-50 hover:text-gray-600`}
            >
              <div className="flex">
                {" "}
                <div
                  className={`cursor-pointer max-w-2 max-h-2 p-3 mx-2 mr-4 rounded-full ${
                    activeIndex === index ? "bg-gray-700 " : " bg-blue-300"
                  }`}
                />
                <span className="block">{faq.question}</span>
              </div>
              <svg
                className={`cursor-pointer -rotate-90 max-w-8 max-h-8 min-w-8 min-h-8 mx-2 mr-4  ${
                  activeIndex === index ? "text-gray-700 " : " text-blue-300"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
              </svg>
            </div>
          ))}
        </div>

        {/* Right side: Answer content */}
        <div className="w-full h-fit lg:w-1/2 mt-10 lg:mt-0 p-6 bg-gray-50 rounded-xl shadow-sm shadow-blue-300  transition-all ease-in-out duration-500 transform">
          <h1 className="text-md font-semibold my-8 text-gray-800">
            {faqData[activeIndex].question}
          </h1>
          <p className="text-sm text-gray-500">{faqData[activeIndex].answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
