import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'

export default function Details(props) {
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

        <div style={{ paddingTop: "300px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ maxWidth: "1500px", width: "100%", height: "fit-content", boxShadow: "none !important" }}>
                <Carousel sx={{ boxShadow: 0 }}>
                    {
                        items.map((item, i) => <Item key={i} item={item} />)
                    }
                </Carousel>

            </div>


            <div>
                
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