import Footer from "../components/Footer";

import PersonIcon from "@mui/icons-material/Person";

function Team() {
  const teamPpl = [
    { img: PersonIcon, name: "Abraham Wendmeneh", job: "Developer" },
    { img: PersonIcon, name: "Michael Demeke", job: "Business Lead" },
    { img: PersonIcon, name: "Sosina Yitay", job: "Marketer" },
    { img: PersonIcon, name: "Dawit Aschalew", job: "Developer" },
    { img: PersonIcon, name: "Biniam Haile", job: "Developer" },
    { img: PersonIcon, name: "Yonathan Tesfaye", job: "Designer" },
    { img: PersonIcon, name: "Samuel Derib", job: "Team Lead" },
    { img: PersonIcon, name: "Dagimawi Woldesenbet", job: "Team Lead" },
    { img: PersonIcon, name: "Naol Zebene", job: "Junior Software Developer" },
    {
      img: PersonIcon,
      name: "Tinsaye Simeneh",
      job: "Junior Software Developer",
    },
  ];
  return (
    <>
      <section className="team-page" style={{paddingTop: "100px"}}>
        <div className="container">
          <div className="team-container">
            {teamPpl.map((ppl, id) => (
              <div key={id} className="team-container__box">
                <div className="team-container__box__img-div">
                  <PersonIcon sx={{ fontSize: 100 }} />
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
                <h3>+251946888444</h3>
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
