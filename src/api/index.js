import axios from "axios";
import { dastopiaAPI } from "../config/constants";

export const url = (path) => dastopiaAPI + path;

export const getDownloadUrl = async (key) => {
  try {
    const response = await axios.post(url("add_vehicle"), {
      operation: "getDownloadPresignedUrl",
      requestDownloadKey: key,
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllVehicles = async () => {
  try {
    const response = await axios.post(url("add_vehicle"), {
      operation: "getAllVehicles",
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getOneVehicle = async (id) => {
  try {
    const response = await axios.post(url("add_vehicle"), {
      operation: "getVehicleById",
      id: id,
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const initializePayment = async (data) => {
  try {
    const response = await axios.post(url("add_vehicle"), {
      operation: "initializePayment",
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      amount: data.amount,
      return_url: "https://dastopia-client.vercel.app/booking-confirmation/",
    });

    return response.data.message.data;
  } catch (err) {
    console.log(err);
  }
};

export const paginatedSearch = async (limit, lastEvaluatedKey) => {
  try {
    const response = await axios.post(url("add_vehicle"), {
      operation: "allVehicle",
      limit: limit ? limit : null,
      // CORRECTED: Typo fixed from lastEValuatedKey to lastEvaluatedKey
      lastEvaluatedKey: lastEvaluatedKey ? lastEvaluatedKey : null,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    // It's good practice to throw the error or return a specific error shape
    // so the calling component knows the request failed.
    throw err;
  }
};
export const fetchVehicles1 = async () => {
  try {
    const response = await axios.get(
      "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/search",
      {
        params: { attribute: "make", value: "Toyota" }, // Matches cURL parameters
        headers: { Accept: "*/*" }, // Optional, but matches the cURL request
      }
    );

    console.log("API Response:", response.data);
  } catch (error) {
    console.error(
      "Error fetching vehicles:",
      error.response ? error.response.data : error.message
    );
  }
};

export const fetchReferral = async () => {
  const token = JSON.parse(localStorage.getItem("customer")).AccessToken;
  const controller = new AbortController();
  let referralCode = ""
  try {
    const res = await fetch(
      `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/referrals/code`,
      {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();
    referralCode = json.data.referralCode;

  } catch (err) {
    if (err.name !== "AbortError") {
      console.log("Error fetching referral code:", err);
      referralCode = "DAS-NO";
    }
  }

  return referralCode;
};
// src/api.js
