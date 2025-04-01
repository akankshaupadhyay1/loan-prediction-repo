'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [formData, setFormData] = useState({
    Country: '',
    Company: '',
    BaseRate: '',
    Inflation: '',
    GDP: '',
    RegulationScore: '',
    LoanAmount: '',
    LoanTerm: ''
  });

  const [error, setError] = useState(null); // State for error messages
  const router = useRouter();

  // Use the backend URL from env variables or fallback to localhost for development
  const backendURL = "http://loan-predict-backend-service.default.svc.cluster.local:8000"
  //process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before making the request
    try {
      const response = await axios.post(
        `${backendURL}/predict`, // Use environment variable or fallback
        formData
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      localStorage.setItem('loan_rate', response.data.loan_rate);
      router.push('/result');
    } catch (err) {
      console.error('API request error:', err); // Log the full error
      setError(err.response?.data?.detail || err.message || 'An unexpected error occurred.'); // Set error message
    }
  };

  return (
    <div>
      <h1>Loan Prediction Form</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={formData[key]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
