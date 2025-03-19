
// app/api/route.js (API Route)
import { NextResponse } from 'next/server';
// import joblib from 'joblib';
import pandas from 'pandas-js';

let model; // Declare model outside the handler
let preprocessor;

try {
    model = joblib.load('loan_pricing_model.pkl');
    preprocessor = model.named_steps.preprocessor;
} catch (error) {
    console.error("Error loading model:", error);
    // Handle the error appropriately, e.g., exit the process
    process.exit(1); // Or throw an error if appropriate for your setup
}



export async function POST(request) {
  try {
    const data = await request.json();

    const input_df = pandas.DataFrame([data]);

    const transformed_data = preprocessor.transform(input_df)

    const prediction = model.predict(transformed_data)[0];

    const output = { ...data, LoanRate: prediction };

    return NextResponse.json(output);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ detail: error.message }, { status: 400 });
  }
}