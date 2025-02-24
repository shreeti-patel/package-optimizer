import React, { useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import './App.css'; // Link to styles

function BoxOptimizer() {
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add formatDimension function here
  const formatDimension = (num) => {
    return Number.isInteger(num) || num % 1 === 0 ? Math.floor(num) : num.toFixed(1);
  };

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const parsedData = parseCSV(text);
      setAvailableBoxes(parsedData.boxes);
      setOrders(parsedData.orders);
    };

    reader.readAsText(file);
  };

  // Fetch and use demo CSV from backend
  const handleDemoUpload = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/demo-csv`);
      const text = await response.text();
      const parsedData = parseCSV(text);
      setAvailableBoxes(parsedData.boxes);
      setOrders(parsedData.orders);
    } catch (error) {
      console.error('Error fetching demo CSV:', error);
    }
  };
  const boxColors = [
    "#fce69b", // Yellow
    "#f7d9c4", // Orange
    "#c4b9db", // Purple
    "#acdcdc", // Teal
    "#f6ccc0", // Pink
    "#bcdcec", // Light Blue
    
    // Add more colors if needed
  ];
  
  // Assign colors based on box size or by order
  
  // Parse CSV content
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const boxes = [];
    const orders = [];
    let orderId = 1;
    let colorIndex = 0;

    lines.forEach(line => {
      const [type, ...values] = line.trim().split(',');
  
      if (type === 'BOX') {
        const [l, w, h] = values.map(Number);
        const color = boxColors[colorIndex]; // Get color based on current index
        boxes.push({ length: l, width: w, height: h, color });
  
        // Increment the color index
        colorIndex++;
  
        // If all colors have been used, loop back to the beginning
        if (colorIndex >= boxColors.length) {
          colorIndex = 0;
        }
      } else if (type === 'ORDER') {
        const products = [];
        for (let i = 0; i < values.length; i += 3) {
          const [l, w, h] = values.slice(i, i + 3).map(Number);
          products.push({ length: l, width: w, height: h });
        }
        orders.push({ id: orderId++, products });
      }
    });

    return { boxes, orders };
  };

  // Process orders through backend
  const processOrders = async () => {
    setIsProcessing(true);
    try {
      console.log("Processing orders...");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/bulk`,
        {
          availableBoxes,
          orders: orders.map(o => ({ products: o.products }))
        }
      );
  
      const processedResults = response.data.map((line, index) => {
        const parts = line.split(',');
        const boxDimensions = parts[parts.length - 1].split('x').map(dim => parseFloat(dim));
        const assignedBox = availableBoxes.find(
          box => Math.abs(box.length - boxDimensions[0]) < 0.001 &&
                 Math.abs(box.width - boxDimensions[1]) < 0.001 &&
                 Math.abs(box.height - boxDimensions[2]) < 0.001
        );
        return {
          orderNumber: orders[index].id,
          products: orders[index].products,
          boxAssigned: parts[parts.length - 1],
          boxColor: assignedBox ? assignedBox.color : '#FFFFFF',
          boxTag: assignedBox 
            ? `<span class="box-tag" style="background-color:${assignedBox.color};">` +
              `${formatDimension(boxDimensions[0])}x${formatDimension(boxDimensions[1])}x${formatDimension(boxDimensions[2])}</span>` 
            : ''  
        };
      });
  
      setResults(processedResults);
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Processing error:', error);
    }
    setIsProcessing(false);
  };
  
  // 📊 Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Order Number',
        accessor: 'orderNumber',
      },
      {
        Header: 'Products',
        accessor: 'products',
        Cell: ({ value }) => (
          <div>
            {value.map((product, idx) => (
              <div key={idx}>
                📦 {formatDimension(product.length)}x{formatDimension(product.width)}x{formatDimension(product.height)}
              </div>
            ))}
          </div>
        ),
      },
      {
        Header: 'Box Assigned',
        accessor: 'boxAssigned',
      },
    ],
    []
  );

  // 🔽 Use React Table with sorting
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: results,
    },
    useSortBy
  );

  return (
    

  <div className="container">
    <div className="header-container">
        
    </div>
    <section className="what-it-does">
      <h3><strong> 💡 What It Does</strong></h3>
      <p>The <strong>Package Optimizer</strong> helps warehouse teams identify the <strong>smallest possible box needed for an order of products</strong> in large volumes. Minimizing box size, helps reduce shipping costs, cut packaging material waste, and better protect products with a snug fit. 💡</p>
      
      <ol>
        <li>➡️ Input the demensions of each product in an order and the available box sizes with a CSV</li>
        <li>⬆️ Outputs the smallest box that fits all products </li>
        <li>📈 To handle high volumes of orders, it processes a bulk CSV file containing multiple orders at once.</li>
      </ol>
    </section>

    <section className="why-it-matters">
      <h3><strong>Why It Matters</strong></h3>
      <p>Optimizing box sizes is not just about neat packaging—it's crucial for:</p>
      <ul>
        <li>💸 Lower shipping fees due to reduced dimensional weight.</li>
        <li>🌱 Less packaging waste (paper, bubble wrap, etc.).</li>
        <li>🔒 Fewer damages from products shifting during transit.</li>
      </ul>
      <p>This tool automates the process, ensuring each order is packed as efficiently as possible.</p>
    </section>

    <section className="how-to-use">
      <h3><strong>How to Use</strong></h3>
      <ol>
        <li>📥 <strong>Upload a CSV file</strong> with your order details (check the CSV format below).</li>
        <li>🖱️ <strong>Or</strong> Click "<strong>Use Demo CSV</strong>" to test the tool with a sample dataset.</li>
        <li>🔍 Click <strong>Run Box Assignment</strong> to run the alogrithm on all the orders and suggest the smallest suitable box for each order based on product dimensions.</li>
      </ol>
      <p>Additionally, you can sort each column in the table. Sort based on box size to pack all orders of the same box size first.</p>
    </section>

    <section className="csv-format">
      <h3><strong>CSV Format</strong></h3>
      <p>Ensure your CSV file includes the following columns (headers must match exactly):</p>
      <ul>
        <li><strong>Type</strong> – Either "BOX" or "ORDER".</li>
        <li><strong>Length</strong> – Length of the item (in inches). 📏</li>
        <li><strong>Width</strong> – Width of the item (in inches). 📐</li>
        <li><strong>Height</strong> – Height of the item (in inches). 📏</li>
      </ul>
      <p>Each row represents either a box size or an order. Orders with multiple products should list each product's length width and height deminemtions of the same row.</p>
    </section>

    <section className="example-csv">
      <h3><strong>Example CSV Format</strong></h3>
      <pre>
{`BOX,5,5,5
BOX,10,10,10
BOX,15,15,15
BOX,20,20,20
ORDER,3,4,6
ORDER,2,2,2,4,4,4
ORDER,5,5,5
ORDER,6,4,2
ORDER,7,2,5
ORDER,3,4,3
ORDER,12,12,12`}
      </pre>
    </section>

    <section className="final-note">
      <p>Once you upload your file, the Package Optimizer will return the optimal box size for each order: helping you ship smarter, not larger! 📦</p>
    </section>
  {/* File Upload Section */}
    <div className="section file-upload">
      <h2>Import CSV</h2>

      <div className="file-upload-container">
        <label className="file-upload-label">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="file-input"
          />
          Choose File
        </label>

        <div className="divider">OR</div>

        <button className="demo-upload-btn" onClick={handleDemoUpload}>
          Use Demo CSV
        </button>
      </div>
    </div>

      
{/* Available Boxes Display */}
  {availableBoxes.length > 0 && (
    <div className="section" ref={(el) => el && el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
      <h2>Available Box Sizes</h2>
      <div className="box-list-container">
        <div className="box-list">
          {availableBoxes.map((box, index) => (
            <span key={index} className="box-tag" style={{ backgroundColor: box.color }}>
              {`${box.length}x${box.width}x${box.height}`}
            </span>
          ))}
        </div>
        <button 
          className="run-assignment-button"
          onClick={processOrders} 
          disabled={!orders.length || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Run Box Assignment'}
        </button>
      </div>
    </div>
  )}




      {/* Results Table */}
        {results.length > 0 && (
          <div id="results-section" className="section table-container" ref={(el) => el && el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          <h2>Results</h2>
          <table {...getTableProps()} className="results-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`sortable-header ${column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''}`}
                  >
                    {column.render('Header')}
                    <span className="sort-icon">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽' // descending
                          : ' 🔼' // ascending
                        : ' ⇅'}  {/* Default sort indicator */}
                    </span>
                  </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      if (cell.column.id === 'boxAssigned') {
                        // Render the Box Tag in the "Box Assigned" column
                        return (
                          <td {...cell.getCellProps()}>
                            {row.original.boxTag ? (
                              <span dangerouslySetInnerHTML={{ __html: row.original.boxTag }} />
                            ) : (
                              <span style={{ color: 'grey' }}>Multiple Boxes Needed</span>
                            )}
                          </td>
                        );
                      }
                      // Default rendering for other cells
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .section {
          margin: 30px 0;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .box-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .box-tag {
          padding: 5px 10px;
          background: #fbd3e3;
          border-radius: 4px;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
        }
        .results-table th, .results-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .results-table th {
          background-color: #4a4a4c;
        }
        button {
          padding: 12px 24px;
          background: #e32366; 
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 8px; 
          cursor: pointer;
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
          transition: background 0.2s ease-in-out;
        }
        button:hover {
          background: #e96b97; /* Slightly darker pink on hover */
        }
        button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default BoxOptimizer;
