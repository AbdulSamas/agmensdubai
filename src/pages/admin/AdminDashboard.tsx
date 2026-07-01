import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Order, Product, Staff } from '../../types';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    ordersToday: 0,
    revenueToday: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [topStaff, setTopStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [ordersData, customersData, productsData, staffData] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('id'),
        supabase.from('products').select('*').order('review_count', { ascending: false }).limit(5),
        supabase.from('staff').select('*').order('total_sales', { ascending: false }).limit(5),
      ]);

      const orders = ordersData.data || [];
      const todayOrders = orders.filter(o => o.created_at.startsWith(today));

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.payment_status === 'paid' || o.status === 'delivered' ? o.total : 0), 0),
        totalCustomers: customersData.data?.length || 0,
        totalProducts: productsData.data?.length || 0,
        ordersToday: todayOrders.length,
        revenueToday: todayOrders.reduce((sum, o) => sum + o.total, 0),
        pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      });

      setRecentOrders(orders.slice(0, 10));
      setTopProducts(productsData.data || []);
      setTopStaff(staffData.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `AED ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-sm text-green-100">Today's Orders</p>
          <p className="text-3xl font-bold mt-1">{stats.ordersToday}</p>
          <p className="text-sm text-green-100 mt-2">Revenue: AED {stats.revenueToday.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl p-6 text-white">
          <p className="text-sm text-amber-100">Pending Orders</p>
          <p className="text-3xl font-bold mt-1">{stats.pendingOrders}</p>
          <Link to="/admin/orders?status=pending" className="text-sm text-amber-100 mt-2 inline-flex items-center gap-1 hover:underline">
            View Pending <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm text-blue-100">Conversion Rate</p>
          <p className="text-3xl font-bold mt-1">
            {stats.totalOrders > 0 ? ((stats.totalOrders / stats.totalCustomers) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-blue-100 mt-2">Orders per customer avg</p>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-amber-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">AED {order.total.toFixed(0)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Top Products</h2>
            <Link to="/admin/products" className="text-sm text-amber-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {topProducts.map((product, i) => (
              <div key={product.id} className="p-4 flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.review_count} reviews</p>
                </div>
                <p className="font-medium">AED {product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Staff */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Top Sales Staff</h2>
          <Link to="/admin/staff" className="text-sm text-amber-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid md:grid-cols-5 gap-4 p-4">
          {topStaff.map((staff, i) => (
            <div key={staff.id} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-2">
                {staff.name.charAt(0)}
              </div>
              <p className="font-medium text-gray-900">{staff.name}</p>
              <p className="text-sm text-gray-500">{staff.total_orders} orders</p>
              <p className="text-sm text-green-600 font-medium">AED {staff.total_sales.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
