import Img1 from "../images/download/appstore.svg";
import Img2 from "../images/download/googleapp.svg";

function Download() {
  return (
    <>
      <section className="download-section">
        <div className="container">
          <div className="download-text">
            <h2> Mobile App Coming Soon</h2>
            <p>
              Thrown shy denote ten ladies though ask saw. Or by to he going
              think order event music. Incommode so intention defective at
              convinced. Led income months itself and houses you.
            </p>
            <div className="download-text__btns">
              <img alt="download_img" src={Img2} />
              <img alt="download_img" src={Img1} />
            </div>
            <h1
              style={{
                color: "brown",
                margin: "0 auto",
                fontSize: "5rem",
              }}
            >
              Coming Soon
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}

export default Download;
