import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Trophy, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Staff } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

export function AdminStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('staff').select('*').order('total_sales', { ascending: false });
      setStaffList(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    await supabase.from('staff').delete().eq('id', id);
    fetchStaff();
  };

  const uniqueReferralCode = () => {
    return 'AG' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Staff</h1>
        <Button
          variant="gold"
          onClick={() => {
            setEditingStaff(null);
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Leaderboard */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold">Top Performers This Month</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {staffList.slice(0, 5).map((staff, i) => (
            <div key={staff.id} className="text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold ${
                i === 0 ? 'bg-amber-400 text-black' :
                i === 1 ? 'bg-gray-300 text-gray-800' :
                i === 2 ? 'bg-orange-400 text-black' :
                'bg-gray-600 text-white'
              }`}>
                {i + 1}
              </div>
              <p className="font-medium text-sm truncate">{staff.name}</p>
              <p className="text-xs text-gray-400">AED {staff.total_sales.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{staff.total_orders} orders</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Commission</p>
              <p className="text-2xl font-bold">AED {(staffList.reduce((sum, s) => sum + (s.total_sales * s.commission_rate / 100), 0)).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Staff Orders</p>
              <p className="text-2xl font-bold">{staffList.reduce((sum, s) => sum + s.total_orders, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">AED {staffList.reduce((sum, s) => sum + s.total_sales, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Earnings</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No staff members</td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.phone || staff.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        staff.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        staff.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{staff.referral_code}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {staff.commission_rate}%
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {staff.total_orders}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      AED {staff.total_sales.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">
                      AED {((staff.total_sales * staff.commission_rate) / 100).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingStaff(staff);
                            setShowForm(true);
                          }}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          staff={editingStaff}
          onClose={() => {
            setShowForm(false);
            setEditingStaff(null);
          }}
          onSave={fetchStaff}
        />
      )}
    </div>
  );
}

function StaffForm({
  staff,
  onClose,
  onSave,
}: {
  staff: Staff | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    referral_code: staff?.referral_code || 'AG' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    role: staff?.role || 'sales',
    commission_rate: staff?.commission_rate?.toString() || '5',
    is_active: staff?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      referral_code: formData.referral_code,
      role: formData.role as 'admin' | 'sales' | 'manager',
      commission_rate: parseFloat(formData.commission_rate) || 5,
      is_active: formData.is_active,
    };

    try {
      if (staff) {
        await supabase.from('staff').update(data).eq('id', staff.id);
      } else {
        await supabase.from('staff').insert([data]);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {staff ? 'Edit Staff' : 'Add Staff Member'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+971 XX XXX XXXX"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Referral Code *"
            value={formData.referral_code}
            onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
            required
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'sales', label: 'Sales Staff' },
              { value: 'manager', label: 'Manager' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          <Input
            label="Commission Rate (%)"
            type="number"
            value={formData.commission_rate}
            onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <span className="text-sm">Active</span>
          </label>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
            <Button variant="gold" type="submit" isLoading={loading}>
              {staff ? 'Update' : 'Create'} Staff
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
