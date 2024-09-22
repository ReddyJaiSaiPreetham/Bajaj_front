import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // For styling

const BACKEND_URL = 'http://localhost:3000/bfhl';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = ['Alphabets', 'Numbers', 'Highest lowercase alphabet'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const result = await axios.post(BACKEND_URL, parsedInput);
      setResponse(result.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid JSON or API error');
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let filteredResponse = {
      is_success: response.is_success,
      user_id: response.user_id,
      email: response.email,
      roll_number: response.roll_number,
    };

    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }

    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = response.numbers;
    }

    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    if (response.file_valid !== undefined) {
      filteredResponse.file_valid = response.file_valid;
      filteredResponse.file_mime_type = response.file_mime_type;
      filteredResponse.file_size_kb = response.file_size_kb;
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>BFHL API Tester</h1>
        <p>Test your API with JSON input and see the results</p>
      </header>
      <main>
        <section className="input-section">
          <h2>Input JSON</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter JSON here"
              rows="5"
              cols="50"
              className="input-textarea"
            />
            <button type="submit" className="submit-button">Submit</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </section>

        {response && (
          <section className="response-section">
            <h2>Response:</h2>
            <div className="checkbox-options">
              {options.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => {
                      setSelectedOptions(prev =>
                        prev.includes(option)
                          ? prev.filter(item => item !== option)
                          : [...prev, option]
                      );
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
            {renderFilteredResponse()}
          </section>
        )}
      </main>
      
    </div>
  );
}

export default App;
