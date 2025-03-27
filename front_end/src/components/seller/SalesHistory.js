import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaShoppingBag, FaChartLine, FaBox as FaBoxIcon } from 'react-icons/fa';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/sales/seller', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const salesData = response.data.data || [];
        setSales(salesData);
        
        // Calculate stats
        const revenue = salesData.reduce((sum, sale) => sum + sale.amount, 0);
        setStats({
          totalSales: salesData.length,
          totalRevenue: revenue,
          averageOrderValue: salesData.length ? revenue / salesData.length : 0
        });
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sales Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <FaShoppingBag className="text-orange-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{stats.totalSales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <FaChartLine className="text-orange-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <FaBox className="text-orange-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Average Order Value</p>
              <p className="text-2xl font-bold">₹{stats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Sales History</h2>
        </div>
        
        {sales.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto text-gray-300 text-5xl mb-4" />
            <p className="text-gray-500 text-lg">No sales records found</p>
            <p className="text-gray-400">Your sales history will appear here once you make your first sale</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.product?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.buyer?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{sale.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          sale.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;