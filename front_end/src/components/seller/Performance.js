import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChartLine, FaUsers, FaShoppingCart, FaStar } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Performance = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalCustomers: 0,
    recentSales: [],
    products: []
  });
  const [loading, setLoading] = useState(true); // Add loading state

  // Add this after the ChartJS.register section
  // Update the chartOptions
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to control its own size
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹)'
        }
      },
      x: {
        ticks: {
          autoSkip: false, // Prevent automatic skipping of labels
          maxRotation: 45, // Rotate labels for better readability
          minRotation: 45
        }
      }
    }
  };
  
  // Update the useEffect to include product data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        // First fetch products
        const productsResponse = await axios.get('http://localhost:5000/api/products/artist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const products = productsResponse.data.data || [];
        
        setStats(prevStats => ({
          ...prevStats,
          products: products,
          totalSales: 0,
          totalRevenue: 0,
          averageRating: 0,
          totalCustomers: 0,
          recentSales: []
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPerformanceData();
  }, []);

  // Move chart data inside the component return to ensure stats.products exists
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</h3>
            </div>
            <FaChartLine className="text-3xl text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalSales || 0}</h3>
            </div>
            <FaShoppingCart className="text-3xl text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Customers</p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers || 0}</h3>
            </div>
            <FaUsers className="text-3xl text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Avg. Rating</p>
              <h3 className="text-2xl font-bold">{(stats.averageRating || 0).toFixed(1)}</h3>
            </div>
            <FaStar className="text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
        {stats.recentSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Product</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-right py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSales.map((sale, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{sale.productName}</td>
                    <td className="py-3">{sale.customerName}</td>
                    <td className="py-3">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="py-3 text-right">₹{(sale.amount || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No sales data available</p>
        )}
      </div>
    {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-right py-3">Price</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="py-3">{product.name}</td>
                    <td className="py-3">{product.category}</td>
                    <td className="py-3 text-right">₹{product.price}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Charts Section continues... */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Product Price Analysis</h2>
        <div className="h-[400px] overflow-x-auto">
          {stats.products && stats.products.length > 0 ? (
            <div className="min-w-[600px] h-full">
              <Bar 
                data={{
                  labels: stats.products.map(product => product.name),
                  datasets: [{
                    label: 'Product Price Distribution',
                    data: stats.products.map(product => product.price),
                    backgroundColor: stats.products.map((_, index) => 
                      `rgba(249, ${115 + (index * 20)}, 22, 0.6)`
                    ),
                    borderColor: stats.products.map((_, index) => 
                      `rgb(249, ${115 + (index * 20)}, 22)`
                    ),
                    borderWidth: 1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No product data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;