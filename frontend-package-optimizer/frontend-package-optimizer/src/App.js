import React, { useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([{ length: '', width: '', height: '' }]);
  const [availableBoxes, setAvailableBoxes] = useState([{ length: '', width: '', height: '' }]);
  const [optimalBox, setOptimalBox] = useState(null);
  const [error, setError] = useState('');

  // Handle input changes for product dimensions
  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  // Handle input changes for box dimensions
  const handleBoxChange = (index, e) => {
    const newBoxes = [...availableBoxes];
    newBoxes[index][e.target.name] = e.target.value;
    setAvailableBoxes(newBoxes);
  };

  // Add a new product input field
  const addProduct = () => {
    setProducts([...products, { length: '', width: '', height: '' }]);
  };

  // Add a new box input field
  const addBox = () => {
    setAvailableBoxes([...availableBoxes, { length: '', width: '', height: '' }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("they touched the butt :P")
    const requestData = {
      products: products.map(product => ({
        length: parseFloat(product.length),
        width: parseFloat(product.width),
        height: parseFloat(product.height),
      })),
      availableBoxes: availableBoxes.map(box => ({
        length: parseFloat(box.length),
        width: parseFloat(box.width),
        height: parseFloat(box.height),
      })),
    };
    console.log(requestData);
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
        console.log(data);
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
        {availableBoxes.map((box, index) => (
          <div key={index}>
            <input
              type="number"
              name="length"
              placeholder="Length"
              value={box.length}
              onChange={(e) => handleBoxChange(index, e)}
              required
            />
            <input
              type="number"
              name="width"
              placeholder="Width"
              value={box.width}
              onChange={(e) => handleBoxChange(index, e)}
              required
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={box.height}
              onChange={(e) => handleBoxChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addBox}>Add Box</button>

        <button type="submit" onClick={handleSubmit}>Optimize</button>
      </form>

      {optimalBox && (
        <div>
          <h2>Optimal Box:</h2>
          <p>{`The best box size is: ${optimalBox.length} x ${optimalBox.width} x ${optimalBox.height}`}</p>
          {/* Display additional details from the response if needed */}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
