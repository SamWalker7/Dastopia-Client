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