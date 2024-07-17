import React, { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, fetchVehicles } from '../store/slices/vehicleSlice';
import { Antenna, Armchair, Calendar, Car, CarFront, CircleDollarSign, DoorOpen, Fuel, List, PaintBucket, Phone } from 'lucide-react';



export default function Details(props) {
    const vehicles = useSelector((state => state.vehicle.vehicles))
    const dispatch = useDispatch();

  
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

    console.log("vehicles", vehicles)


    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!"
        },
        {
            name: "Random Name #2",
            description: "Hello World!"
        }
    ]

    return (

        <div style={{ paddingTop: "300px", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "2000px", alignItems: "center", alignContent: "center" }}>
            <div style={{ maxWidth: "1500px", width: "100%", height: "fit-content", boxShadow: "none !important" }}>
                <Carousel sx={{ boxShadow: 0 }}>
                    {
                        items.map((item, i) => <Item key={i} item={item} />)
                    }
                </Carousel>

            </div>


            <div style={{ display: "flex", justifyContent: "flex-start", alignContent: "flex-start", alignItems: "flex-start", maxWidth: "1500px", width: "100%", padding: "15px", }}>
                <div style={{ width: "100%" }}>
                    <h1 style={{ fontSize: "45px", fontWeight: "bolder" }}>Car Name</h1>

                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>4.63 ⭐</p>

                    <div style={{ display: "flex", gap: "6px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <DoorOpen />
                            <p style={{ fontSize: "10px", fontWeight: "bold" }}>4 doors</p>
                        </div>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <PaintBucket />
                            <p style={{ fontSize: "10px", fontWeight: "bold" }}>red color</p>
                        </div>

                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <Armchair />
                            <p style={{ fontSize: "10px", fontWeight: "bold" }}>4 Seats</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <Car />
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>Make</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <CarFront />
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>Model</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <Calendar />
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>Year</p>
                        </div>
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
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>Automatic</p>
                        </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <List />
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>Category</p>
                        </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <Phone />
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>+2519161514</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <Antenna />
                            <p style={{ fontSize: "15px", fontWeight: "bold" }}>Transmission</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "20px" , display:"flex", flexDirection:"column", gap:"2px"}}>
                        <label style={{ fontSize: "15px", fontWeight: "bold" }}>Pickup loction</label>
                        <select style={{padding:"4px 20px 4px 20px", maxWidth:"190px", fontWeight:"bold"}}>
                            <option >Dani Plaza</option>
                        </select>
                    </div>

                    <div style={{ marginTop: "20px" , display:"flex", flexDirection:"column", gap:"2px"}}>
                       <button style={{maxWidth:"190px", background:"", padding:"4px 20px 4px 20px", border: "1px solid blue", borderRadius: "10px"}} className="colored-button">
                        Continue
                       </button>
                    </div>
                </div>
            </div>

            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "flex_start", width:"100%", maxWidth:"1500px"}}>
                <div style={{width: "100%",}}>
                
                <p style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "10px" }} >Description: </p>
                <p style={{fontSize: "13px", width:"50%"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                 printer took a galley of type and scrambled it to make a type specimen book. It has survived 
                 not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                 It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                </div>
            </div>
        </div>
    )
}

function Item(props) {
    return (
        <Paper style={{ boxShadow: "none" }}>
            <div style={{ maxHeight: "392px", maxWidth: "1500px", position: "relative" }}>
                <img style={{ objectFit: "contain", width: "100%", height: "100%" }} src='https://preview.redd.it/i-dont-understand-the-fanboying-behind-the-mk4-a80-supra-i-v0-l5wlgron0kea1.jpg?width=1080&crop=smart&auto=webp&s=148d570f0c785c87053d8cc379af39cf665a5986' />
            </div>
        </Paper>
    )
}