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

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      localStorage.setItem('loan_rate', response.data.loan_rate);
      router.push('/result');
    } catch (error) {
      alert('Error: ' + error.response.data.detail);
    }
  };

  return (
    <div>
      <h1>Loan Prediction Form</h1>
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
