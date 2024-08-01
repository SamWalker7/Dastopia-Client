import axios from "axios"
import { dastopiaAPI } from "../config/constants";

const url = (path) => (dastopiaAPI + path);

export const getDownloadUrl = async (key) => {
    try {
        const response = await axios.post(url('add_vehicle'), {
            operation: "getDownloadPresignedUrl",
            requestDownloadKey: key
        });
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export const getAllVehicles = async () => {
    try {
        const response = await axios.post(url('add_vehicle'), {
            "operation": "getAllVehicles",
        });
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export const initializePayment = async (data) => {
    try{
        const response = await axios.post(url('add_vehicle'), {
            'operation': 'initializePayment',
            'first_name': data.firstName,
            'last_name': data.lastName,
            'email': data.email,
            'amount': Math.floor(Math.random() * (10000 - 500 + 1)) + 500
        })

        return response.data.message.data
    }catch(err){
        console.log(err)
    }
}