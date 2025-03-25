// app/api/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const data = await request.json();

        // Get the backend URL from environment variables or use a default
        const backendUrl = 'http://loan-predict-backend-service:8000/predict';


        // Send the data to the backend API
        const response = await axios.post(backendUrl, data);

        // Assuming the backend returns a JSON with a 'prediction' field
        const prediction = response.data.prediction;

        // Construct the output JSON
        const output = { ...data, LoanRate: prediction };

        // Return the JSON response
        return NextResponse.json(output);

    } catch (error) {
        console.error("API Error:", error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Backend Error:", error.response.data);
            return NextResponse.json({ detail: error.response.data }, { status: error.response.status });
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response from backend:", error.request);
            return NextResponse.json({ detail: "No response from backend" }, { status: 500 });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
            return NextResponse.json({ detail: error.message }, { status: 500 });
        }
    }
}