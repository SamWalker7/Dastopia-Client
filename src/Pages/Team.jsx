import Footer from "../components/Footer";

import PersonIcon from "@mui/icons-material/Person";

function Team() {
  const teamPpl = [
    { img: PersonIcon, name: "Abraham Wendmeneh", job: "Role Placeholder" },
    { img: PersonIcon, name: "Michael Demeke", job: "Role Placeholder" },
    { img: PersonIcon, name: "Sosina Yitay", job: "Role Placeholder" },
    { img: PersonIcon, name: "Dawit Aschalew", job: "Role Placeholder" },
    { img: PersonIcon, name: "Biniam Haile", job: "Role Placeholder" },
    { img: PersonIcon, name: "Yonathan Tesfaye", job: "Role Placeholder" },
    { img: PersonIcon, name: "Naol Zebene", job: "Junior Software Engineer" },
    {
      img: PersonIcon,
      name: "Tinsaye Simeneh",
      job: "Junior Software Developer",
    },
  ];
  const boardMembers = [
    { img: PersonIcon, name: "Samuel Derib", job: "Board Member" },
    { img: PersonIcon, name: "Dagimawi Woldesenbet", job: "Board Member" },
    { img: PersonIcon, name: "Alemayehu Gemeda", job: "Board Member" },
  ];
  return (
    <>
      <section className="team-page" style={{ paddingTop: "100px" }}>
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
