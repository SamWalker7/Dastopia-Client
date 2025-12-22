import React, { useState } from "react";

// Questions and answers data

const faqData = [
  {
    category: "General",
    items: [
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
    ],
  },

  {
    category: "Referral Program",
    items: [
      {
        id: "referral-how-it-works",
        question: "How does the referral program work?",
        answer:
          "Share your referral code with friends. When someone signs up using your code and completes their first booking within 90 days, you earn a commission automatically.",
      },
      {
        id: "find-referral-code",
        question: "Where can I find and share my referral code?",
        answer:
          "Go to Menu → Commission Wallet. You’ll find your referral code there with Copy and Share buttons to easily send it to friends.",
      },
    ],
  },
];



const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Default to the second question

  const allFaqItems = faqData.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      category: section.category,
    }))
  );



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
          {allFaqItems.map((faq, index) => (
            <div
              key={faq.id}
              id={faq.id} // ✅ unique anchor
              onClick={() => handleClick(index)}
              className={`cursor-pointer p-4 flex justify-between transition-all duration-300 ${activeIndex === index
                ? "bg-blue-50 text-black font-medium"
                : "text-gray-700"
                } hover:bg-blue-50`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 mr-4 rounded-full ${activeIndex === index ? "bg-gray-700" : "bg-blue-300"
                    }`}
                />
                <span className="block">
                  {faq.question}
                  <span className="block text-xs text-gray-400 mt-1">
                    {faq.category}
                  </span>
                </span>
              </div>
            </div>
          ))}

        </div>

        {/* Right side: Answer content */}
        <div className="w-full h-fit lg:w-1/2 mt-10 lg:mt-0 p-6 bg-gray-50 rounded-xl shadow-sm shadow-blue-300  transition-all ease-in-out duration-500 transform">
          <h1 className="text-md font-semibold my-6 text-gray-800">
            {allFaqItems[activeIndex].question}
          </h1>

          <p className="text-sm text-gray-500">
            {allFaqItems[activeIndex].answer}
          </p>

        </div>
      </div>
    </div>
  );
};

export default FAQPage;