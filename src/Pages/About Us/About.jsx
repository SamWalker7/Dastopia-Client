import Footer from "../../components/Footer";
import BackgroundImage from "../../images/hero/OBJECTS1.png";
import BackgroundImage1 from "../../images/hero/OBJECTS.png";
import mission from "../../images/about/mission.png";
import story from "../../images/about/story.png";
import Sosina from "../../images/team/sosina.jpg";
import Yonathan from "../../images/team/yonathan.jpg";
import Abraham from "../../images/team/abraham.JPG";
import Tinsaye from "../../images/team/Tinsaye.jpg";
import Binyam from "../../images/team/binyam.png";
import Michael from "../../images/team/michael.jpg";
import Alemayehu from "../../images/team/alemayehu.jpg";
import PersonIcon from "@mui/icons-material/Person";
import community from "../../images/about/community.png";
import user from "../../images/about/user.png";
import verified from "../../images/about/verified.png";
import wide from "../../images/about/wide.png";

function About() {
  const teamPpl = [
    { img: Michael, name: "Michael Demeke", job: "Commercial Manager" },
    { img: Sosina, name: "Sosina Yitay", job: "Procurement Consultant" },

    { img: Yonathan, name: "Yonathan Tesfaye", job: "UI/UX Designer" },
    {
      img: Abraham,
      name: "Abraham Wendmeneh",
      job: "Junior Software Developer",
    },
    { img: PersonIcon, name: "Dawit Aschalew", job: "Role Placeholder" },
    { img: Binyam, name: "Biniam Haile", job: "Mobile Application Developer" },
    { img: PersonIcon, name: "Naol Zebene", job: "Junior Software Engineer" },
    {
      img: Tinsaye,
      name: "Tinsaye Simeneh",
      job: "Junior Software Developer",
    },
  ];
  const boardMembers = [
    { img: PersonIcon, name: "Samuel Derib", job: "Board Member" },
    { img: PersonIcon, name: "Dagimawi Woldesenbet", job: "Board Member" },
    { img: Alemayehu, name: "Alemayehu Kebede", job: "Co-founder" },
  ];
  return (
    <div className=" flex flex-col   ">
      <div
        className="relative h-fit md:py-20 md:pt-72 md:px-96 flex items-center justify-center"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for background darkening */}
        <div className="absolute inset-0 bg-[#00173C] opacity-90"></div>
        {/* Content */}
        <div className="relative z-10 text-center  text-white p-8">
          <h1 className="text-4xl  md:text-[100px] text-[#FBBC05] font-semibold mt-8 mb-24">
            DasGuzo
          </h1>
          <h1 className="md:text-6xl text-3xl mb-8">Search. Book. Rent.</h1>
          <p className="text-lg md:text-xl text-gray-300 font-normal mb-12">
            At DASGUZO, we believe that renting a car should be as easy as
            getting a ride. We’re not just another car rental service—we’re a
            community-driven platform that connects car owners with those in
            need of a vehicle. Whether you’re planning a weekend getaway or need
            a reliable ride for a business trip, DASGUZO offers a seamless,
            affordable, and trustworthy solution for all your car rental needs.
          </p>
        </div>
      </div>

      <div className="md:flex ">
        <div className="md:w-1/2 flex flex-col space-y-4 justify-center items-start w-full bg-[#D8E2FF] p-16">
          <div>
            <img src={mission} className="w-32 h-32" alt="" />
          </div>
          <div>
            <h1 className="text-7xl font-semibold">Our Mission</h1>
          </div>
          <div className="text-lg">
            Our mission is to make car rentals accessible and hassle-free for
            everyone. We aim to create a platform that prioritizes convenience,
            trust, and community. We strive to provide a diverse range of
            vehicles to suit every lifestyle, ensuring that you can find the
            perfect car for any occasion. Our commitment to safety and security
            means that every rental experience is backed by our rigorous
            verification processes and comprehensive insurance options.
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col space-y-4 justify-center items-start w-full bg-white p-32">
          <div>
            <img src={story} className="w-32 h-32" alt="" />
          </div>
          <div>
            <h1 className="text-7xl font-semibold">Our Story</h1>
          </div>
          <div className="text-lg">
            DASGUZO was born out of a desire to transform the traditional car
            rental experience. Our founders, passionate travelers and tech
            enthusiasts, recognized the challenges of renting cars—long queues,
            limited options, and high costs. They envisioned a platform where
            car rental could be simplified, where the power is in the hands of
            the community, and where every car has a story. With that vision,
            DASGUZO was created, bringing together technology and trust to
            create a new way of renting cars.
          </div>
        </div>
      </div>

      <div className=" md:flex  bg-[#FBBC05] p-16">
        <div className="text-4xl md:text-8xl flex text-[#00173C] justify-center items-center font-semibold md:w-1/3">
          {" "}
          Why Choose DASGUZO?
        </div>
        <div className="flex flex-col md:px-16 space-y-8">
          <div className="flex">
            <div>
              <img src={community} className="w-16 h-16" alt="" />
            </div>
            <div className="flex flex-col space-y-2 px-8">
              <div className="text-2xl md:text-4xl font-semibold text-[#00173C]">
                {" "}
                Comunity-Driven
              </div>
              <div className="md:text-xl">
                At the heart of DASGUZO is our community. We empower car owners
                to share their vehicles with others, fostering a sense of trust
                and collaboration.
              </div>
            </div>
          </div>
          <div className="flex">
            <div>
              <img src={wide} className="w-16 h-16" alt="" />
            </div>
            <div className="flex flex-col space-y-2 px-8">
              <div className="text-2xl md:text-4xl font-semibold text-[#00173C]">
                {" "}
                Wide Selection
              </div>
              <div className="md:text-xl">
                From compact cars to luxury vehicles, we offer a wide range of
                options to suit every need and budget.
              </div>
            </div>
          </div>
          <div className="flex">
            <div>
              <img src={user} className="w-16 h-16" alt="" />
            </div>
            <div className="flex flex-col space-y-2 px-8">
              <div className="text-2xl md:text-4xl font-semibold text-[#00173C]">
                {" "}
                User-Friendly Experience
              </div>
              <div className="md:text-xl">
                Our intuitive platform makes it easy to find, book, and manage
                rentals—all in just a few clicks.
              </div>
            </div>
          </div>
          <div className="flex">
            <div>
              <img src={verified} className="w-16 h-16" alt="" />
            </div>
            <div className="flex flex-col space-y-2 px-8">
              <div className="text-2xl md:text-4xl font-semibold text-[#00173C]">
                {" "}
                Verified and Secure
              </div>
              <div className="md:text-xl">
                We prioritize your safety with rigorous owner verification,
                secure payment processes, and comprehensive insurance coverage.
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        style={{
          backgroundImage: `url(${BackgroundImage1})`,
        }}
        className=" flex flex-col overflow-hidden bg-auto  "
      >
        <div className="w-full justify-center p-8 flex flex-col md:py-10 md:px-20 items-center">
          <div>
            <h1 className="text-8xl my-24 text-[#00173C] font-semibold w-full text-center">
              Meet the Team
            </h1>
          </div>
          <div className="grid md:grid-cols-3 gap-10 w-2/3 content-center grid-cols-1 justify-center items-center">
            {teamPpl.map((ppl, id) => (
              <div key={id} className="flex-col justify-center items-center">
                <div className="justify-center items-center flex">
                  {ppl.img === PersonIcon ? (
                    <PersonIcon sx={{ fontSize: 100 }} />
                  ) : (
                    <img
                      src={ppl.img}
                      alt="team member"
                      className="rounded-full h-72 w-72 object-cover object-center"
                    />
                  )}
                </div>
                <div className="flex flex-col w-full justify-center my-8 items-center">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    {ppl.name}
                  </h3>
                  <p className="text-xl text-gray-500">{ppl.job}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-8xl my-24 text-[#00173C] font-semibold w-full text-center">
            Board Members
          </p>
          <div className="grid md:grid-cols-3 gap-10 w-2/3 content-center grid-cols-1 justify-center items-center">
            {boardMembers.map((ppl, id) => (
              <div key={id} className="flex-col justify-center items-center">
                <div className="justify-center items-center flex">
                  {ppl.img === PersonIcon ? (
                    <PersonIcon sx={{ fontSize: 100 }} />
                  ) : (
                    <img
                      src={ppl.img}
                      alt="team member"
                      className="rounded-full h-96 w-96  object-center"
                    />
                  )}
                </div>
                <div className="flex flex-col w-full justify-center my-8 items-center">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    {ppl.name}
                  </h3>
                  <p className="text-xl text-gray-500">{ppl.job}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;
