import React, { useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([{ length: '', width: '', height: '' }]);
  const [availableBoxes, setAvailableBoxes] = useState(['box1', 'box2']); // Example boxes
  const [optimalBox, setOptimalBox] = useState(null);
  const [error, setError] = useState('');

  // Handle input changes for product dimensions
  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  // Add a new product input field
  const addProduct = () => {
    setProducts([...products, { length: '', width: '', height: '' }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const requestData = {
      products: products.map(product => ({
        length: parseFloat(product.length),
        width: parseFloat(product.width),
        height: parseFloat(product.height),
      })),
      availableBoxes,
    };

    try {
      const response = await fetch('http://localhost:8080/api/optimize-box', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        const data = await response.json();
        setOptimalBox(data);
      } else {
        setError('Error with the request.');
      }
    } catch (err) {
      setError('Error with the request.');
    }
  };

  return (
    <div className="App">
      <h1>Package Optimizer</h1>
      <form onSubmit={handleSubmit}>
        <h3>Products</h3>
        {products.map((product, index) => (
          <div key={index}>
            <input
              type="number"
              name="length"
              placeholder="Length"
              value={product.length}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <input
              type="number"
              name="width"
              placeholder="Width"
              value={product.width}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={product.height}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addProduct}>Add Product</button>

        <h3>Available Boxes</h3>
        <select multiple>
          {availableBoxes.map((box, index) => (
            <option key={index} value={box}>{box}</option>
          ))}
        </select>

        <button type="submit">Optimize</button>
      </form>

      {optimalBox && (
        <div>
          <h2>Optimal Box:</h2>
          <p>{`The best box size is: ${optimalBox.boxName}`}</p>
          {/* Display the full response or other useful details here */}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
