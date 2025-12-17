import BackgroundImage from "../../images/howitworks/renterBg.png";

const referralSteps = [
    {
        title: "Get Your Referral Code",
        description:
            "Every user receives a unique referral code upon signup. You can find it in your profile or referral wallet.",
    },
    {
        title: "Share Your Code",
        description:
            "Share your referral code with friends via WhatsApp, SMS, social media, or any platform you like.",
    },
    {
        title: "Friend Signs Up",
        description:
            "Your friend signs up using your referral code. The referral is automatically tracked by the system.",
    },
    {
        title: "First Booking Completed",
        description:
            "When your referred friend completes their first booking within 90 days, the referral becomes eligible.",
    },
    {
        title: "Earn Commission",
        description:
            "You earn 10% commission from the platform fee. The commission is automatically added to your wallet.",
    },
];

const ReferralSteps = () => {
    return (
        <div className="flex flex-col items-center justify-center mb-12 md:mb-20">
            <p className="w-full px-6 text-center text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl md:w-2/3 lg:w-1/2 my-8 md:my-12 lg:my-16">
                DASGuzo’s referral program allows you to earn commission by inviting friends.
                Follow these steps to start sharing and earning rewards effortlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 pb-10 w-full">
                {referralSteps.map((step, index) => (
                    <div key={index} className="w-full">
                        <div className="bg-[#00173C] rounded-2xl shadow-lg h-full flex flex-col"
                        style={{
                                          backgroundImage: `url(${BackgroundImage})`,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}>
                            <div className="text-white p-6 md:p-8 flex-grow">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFD700] text-black font-bold mb-4">
                                    {index + 1}
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3">
                                    {step.title}
                                </h1>
                                <p className="text-sm sm:text-base text-gray-300 md:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="mt-12 text-black rounded-2xl p-8 text-center">

                <h4 className="text-2xl font-semibold mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFD700] text-black font-bold mb-4">
                        5
                    </div>
                    Earn Commission</h4>
                <p className="text-lg opacity-90">
                    You earn 10% commission from the platform fee. The commission is automatically added to your wallet.
                </p>
            </div> */}
        </div>
    );
};

export default ReferralSteps;
