import Footer from "../components/Footer";
import Sosina from "../images/team/sosina.jpg";
import Yonathan from "../images/team/yonathan.jpg";
import Abraham from "../images/team/abraham.JPG";
import Tinsaye from "../images/team/Tinsaye.jpg";
import Binyam from "../images/team/binyam.png";
import Michael from "../images/team/michael.jpg";
import Alemayehu from "../images/team/alemayehu.jpg";
import PersonIcon from "@mui/icons-material/Person";

function Team() {
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
    <>
      <section className="team-page" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="team-container">
            {teamPpl.map((ppl, id) => (
              <div key={id} className="team-container__box">
                <div className="team-container__box__img-div">
                  {ppl.img === PersonIcon ? (
                    <PersonIcon sx={{ fontSize: 100 }} />
                  ) : (
                    <img src={ppl.img} alt="team member" height={350} />
                  )}
                </div>
                <div className="team-container__box__descr">
                  <h3>{ppl.name}</h3>
                  <p>{ppl.job}</p>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Board Members
          </p>
          <div className="team-container">
            {boardMembers.map((ppl, id) => (
              <div key={id} className="team-container__box">
                <div className="team-container__box__img-div">
                  {ppl.img === PersonIcon ? (
                    <PersonIcon sx={{ fontSize: 100 }} />
                  ) : (
                    <img src={ppl.img} alt="team member" height={350} />
                  )}
                </div>
                <div className="team-container__box__descr">
                  <h3>{ppl.name}</h3>
                  <p>{ppl.job}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>(251) 946-888444</h3>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Team;
