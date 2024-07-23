import { useEffect, useState } from "react";
import CarBox from "./CarBox";
import { CAR_DATA } from "./CarData";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../store/slices/vehicleSlice";

function PickCar() {
  const [active, setActive] = useState("SecondCar");
  const [colorBtn, setColorBtn] = useState("btn1");
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  const vehicles = useSelector((state => state.vehicle.vehicles));


  useEffect(() => {
    const loadData = async () => {
      const response = await dispatch(fetchVehicles())
      if (fetchVehicles.fulfilled.match(response)) {
        const vehicles = response.payload;
        vehicles.map(async (vehicle) => {
          await dispatch(fetchImages(vehicle))
        })
      }
    }
    if (vehicles.length < 1) {
      loadData();
    }
  }, []);

  useEffect(() => {
    setData(vehicles.slice(0, 5));
    // console.log(vehicles[0], "first car")

    if (vehicles.length) {
      setActive(vehicles[0].id);
    }
  }, [vehicles])


  console.log("vehicles", data)

  const btnID = (id) => {
    setColorBtn(colorBtn === id ? "" : id);
  };

  const coloringButton = (id) => {
    return colorBtn === id ? "colored-button" : "";
  };

  return (
    <>
      <section className="pick-section">
        <div className="container">
          <div className="pick-container">
            <div className="pick-container__title">
              <h3>Vehicle Models</h3>
              <h2>Our rental fleet</h2>
              <p>
                Choose from a variety of our amazing vehicles to rent for your
                next adventure or business trip
              </p>
            </div>
            <div className="pick-container__car-content">
              {/* pick car */}
              <div className="pick-box">
                {
                  data.map((d) => {
                    return (
                      <button
                        className={`${d.id === active ? coloringButton("btn1") : ""}`}
                        onClick={() => {
                          setActive(d.id);
                          if (d.id === active) {
                            btnID("btn1");
                          }
                        }}
                      >
                        {d.model} {d.make}
                      </button>
                    )
                  })

                }
              </div>


              {data.map((d, i) => {
                if (active === d.id) {
                  return (
                    <CarBox data={d} carID={i} />
                  )
                }
              })}



            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PickCar;
