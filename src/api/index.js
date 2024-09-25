import axios from "axios"
import { dastopiaAPI } from "../config/constants";
import BASE_URL from "./baseUrl";

export const url = (path) => (dastopiaAPI + path);

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

export const getOneVehicle = async(id) => {
    try{
        const response = await axios.get(`${BASE_URL}/vehicle/${id}`, {
            "operation": "getVehicleById",
            id: id
        })

        return response.data
    }catch(err){
        console.error(err)
    }
}

export const initializePayment = async (data) => {
    try{
        const response = await axios.post(url('add_vehicle'), {
            'operation': 'initializePayment',
            'first_name': data.firstName,
            'last_name': data.lastName,
            'email': data.email,
            'amount': data.amount,
            "return_url": "https://dastopia-client.vercel.app/booking-confirmation/"
        })

        return response.data.message.data
    }catch(err){
        console.log(err)
    }
}

export const paginatedSearch = async(limit, lastEvaluatedKey) => {
    try{

        const response = await axios.post(url('add_vehicle'), {
            'operation': "allVehicle",
            'limit': limit ? limit : null,
            lastEValuatedKey: lastEvaluatedKey ? lastEvaluatedKey : null
        })

        return response.data
    }catch(err){
        console.log(err)
    }
}