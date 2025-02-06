import React, { useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import './App.css'; // Link to styles

function BoxOptimizer() {
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);


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

  // Parse CSV content
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const boxes = [];
    const orders = [];
    let orderId = 1;

    lines.forEach(line => {
      const [type, ...values] = line.trim().split(',');

      if (type === 'BOX') {
        const [l, w, h] = values.map(Number);
        boxes.push({ length: l, width: w, height: h });
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

      // Map results to orders
      const processedResults = response.data.map((line, index) => {
        const parts = line.split(',');
        return {
          orderNumber: orders[index].id,
          products: orders[index].products,
          boxAssigned: parts[parts.length - 1]
        };
      });

      setResults(processedResults);
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
                📦 {product.length}x{product.width}x{product.height}
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
      <h1>Box Assignment Optimizer</h1>
      
      {/* File Upload Section */}
      <div className="section">
        <h2>1. Import CSV</h2>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload}
        />

        <div style={{ textAlign: 'left', margin: '10px 0', fontWeight: 'bold' }}>
          OR
        </div>

        <button onClick={handleDemoUpload}>Use Demo CSV</button>
      </div>

      {/* Available Boxes Display */}
      {availableBoxes.length > 0 && (
        <div className="section">
          <h2>Available Box Sizes</h2>
          <div className="box-list">
            {availableBoxes.map((box, index) => (
              <span key={index} className="box-tag">
                {`${box.length}x${box.width}x${box.height}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Processing Button */}
      <div className="section">
        <h2>2. Run Box Assignment</h2>
        <button 
          onClick={processOrders} 
          disabled={!orders.length || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Run Box Assignment'}
        </button>
      </div>

      {/* Results Table */}
        {results.length > 0 && (
          <div className="section table-container">
          <h2>Results</h2>
          <table {...getTableProps()} className="results-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="sortable-header"
                    >
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
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
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
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
          background-color: #f5f5f5;
        }
        button {
          padding: 12px 24px;
          background: #ff4f87; 
          color: black;
          font-weight: bold;
          border: none;
          border-radius: 8px; 
          cursor: pointer;
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
          transition: background 0.2s ease-in-out;
        }
        button:hover {
          background: #e04378; /* Slightly darker pink on hover */
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
