import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, fetchVehicles } from '../store/slices/vehicleSlice';
import { Antenna, Armchair, Calendar, Car, CarFront, CircleDollarSign, CircleUser, DoorOpen, Fuel, List, PaintBucket, Phone } from 'lucide-react';
import MapComponent from '../components/GoogleMaps';
import { useParams } from 'react-router-dom';



export default function Details(props) {
    const { id } = useParams();
    const [selected, setSelected] = useState(null)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [imageLoading, setImageLoading] = useState(true)
    const vehicles = useSelector((state => state.vehicle.vehicles))

    const dispatch = useDispatch();

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };


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
        vehicles.map((v) => {
            if (v.id === id) {
                setSelected(v);
                if (!v.imageLoading) {
                    console.log(imageLoading, "image loading")

                    setImageLoading(false);
                }
            }
        })
    }, [vehicles]);


    const styles = {
        formControl: {
            minWidth: "20%",
            marginRight: "16px",
            marginBottom: "10px",
            flex: "1 0 20%",
            marginTop: "2rem",
            fontSize: "16px"
        },
    }


    return (
        <>
            {
                selected ? (<div style={{ paddingTop: "300px", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "2000px", alignItems: "center", alignContent: "center" }}>
                    <div style={{ maxWidth: "1000px", width: "100%", height: "fit-content", boxShadow: "none !important" }}>

                        <Carousel sx={{ boxShadow: 0 }}>
                            {
                                selected.images.map((item) => <Item item={item} imageLoading={imageLoading} />)
                            }
                        </Carousel>

                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignContent: "flex-start", alignItems: "flex-start", maxWidth: "1000px", width: "100%", padding: "15px", }}>
                        <div style={{ width: "100%" }}>
                            <h1 style={{ fontSize: "45px", fontWeight: "bolder" }}>{selected.make} {selected.model}</h1>

                            <p style={{ fontSize: "20px", fontWeight: "bold" }}>4.63 ⭐</p>

                            <div style={{ display: "flex", gap: "6px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <DoorOpen />
                                    <p style={{ fontSize: "10px", fontWeight: "bold" }}>{selected.doors} doors</p>
                                </div>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <PaintBucket />
                                    <p style={{ fontSize: "10px", fontWeight: "bold" }}>{selected.color} color</p>
                                </div>

                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <Armchair />
                                    <p style={{ fontSize: "10px", fontWeight: "bold" }}>{selected.seats} Seats</p>
                                </div>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <Car />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.make}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <CarFront />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.model}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <Calendar />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.year} Year</p>
                                </div>
                            </div>

                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", maxWidth: "190px" }}>

                                <label style={{ fontSize: "15px", fontWeight: "bold" }}>Trip start</label>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    variant="outlined"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    InputLabelProps={{ shrink: true }}
                                    style={styles.formControl}
                                />


                            </div>

                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", maxWidth: "190px" }}>
                                <label style={{ fontSize: "15px", fontWeight: "bold" }}>Trip End</label>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    variant="outlined"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    InputLabelProps={{ shrink: true }}
                                    style={styles.formControl}
                                />


                            </div>
                        </div>
                        <div style={{ width: "100%", }}>
                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <CircleDollarSign />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>37 / day</p>
                                </div>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <Fuel />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.fuelType}</p>
                                </div>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <List />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.category}</p>
                                </div>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <Phone />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.ownerPhone}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                                    <Antenna />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>{selected.transmission}</p>
                                </div>
                            </div>



                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "2px" }}>
                                <label style={{ fontSize: "15px", fontWeight: "bold" }}>Pickup loction</label>
                                <select style={{ padding: "4px 20px 4px 20px", maxWidth: "190px", fontWeight: "bold" }}>
                                    <option >Dani Plaza</option>
                                </select>
                            </div>

                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "2px" }}>
                                <button style={{ maxWidth: "190px", background: "", padding: "10px 20px 10px 20px", border: "1px solid blue", borderRadius: "10px", cursor: "pointer" }} className="colored-button">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex_start", width: "100%", maxWidth: "1000px" }}>
                        <div style={{ width: "100%", }}>

                            <p style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "10px" }} >Description: </p>
                            <p style={{ fontSize: "13px", width: "50%" }}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                                printer took a galley of type and scrambled it to make a type specimen book. It has survived
                                not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </p>
                        </div>
                    </div>


                    <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", marginBottom: "10px", justifyContent: "flex-start", alignItems: "flex_start", width: "100%", maxWidth: "1000px", gap: "14px" }}>
                        <p style={{ fontSize: "16px", color: "gray" }}>Reviews</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                            {selected.row ?
                                (<><div style={{ display: "flex", gap: "14px", borderBottom: "1px solid gray", paddingBottom: "18px" }}>
                                    <div style={{ maxWidth: "60px", maxHeight: "60px" }}>
                                        <CircleUser style={{ width: "60px", height: "60px" }} />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                        <p style={{ fontSize: "16px" }}> ⭐ ⭐ ⭐ ⭐ ⭐ </p>
                                        <div style={{ display: "flex", gap: "2px", color: "gray" }}>
                                            <p> User </p>
                                            <p>July 3, 2024</p>
                                        </div>
                                        <p style={{ width: "50%", fontSize: "13px" }}>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                                        </p>
                                    </div>
                                </div>

                                    <div style={{ display: "flex", gap: "14px" }}>
                                        <div style={{ maxWidth: "60px", maxHeight: "60px" }}>
                                            <CircleUser style={{ width: "60px", height: "60px" }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                            <p style={{ fontSize: "16px" }}> ⭐ ⭐ ⭐ ⭐ ⭐ </p>
                                            <div style={{ display: "flex", gap: "2px", color: "gray" }}>
                                                <p> User </p>
                                                <p>July 3, 2024</p>
                                            </div>
                                            <p style={{ width: "50%", fontSize: "13px" }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                                            </p>
                                        </div>
                                    </div> </>) : <p style={{ fontSize: "16px" }}>No reviews yet</p>}



                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex_start", width: "100%", maxWidth: "1000px", marginTop: "20px", flexDirection: "column", gap: "14px", paddingBottom: "10px" }}>
                        <p style={{ fontSize: "16px", color: "gray" }}>Location</p>
                        <div style={{ width: "100%", }}>
                            <MapComponent />
                        </div>
                    </div>
                </div>) : <div style={{ paddingTop: "200px" }}> <p style={{ fontSize: "20px" }}> loading ... </p></div>
            }
        </>
    )
}

function Item(props) {

    const [loading, setLoading] = useState(true)
    return (

        <Paper style={{ boxShadow: "none" }}>

            <div style={{ maxHeight: "392px", maxWidth: "1500px", position: "relative" }}>
                {loading && <span className="loader"></span>}
                {!props.imageLoading &&
                    <img style={{ objectFit: "contain", width: "100%", height: "100%" }} src={props.item} onLoad={() => setLoading(false)} />
                }
            </div>
        </Paper>
    )
}