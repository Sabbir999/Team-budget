import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import PaymentForm from '../components/payments/PaymentForm';
import PaymentTable from '../components/payments/PaymentTable';
import { Plus, Search, Filter, X } from 'lucide-react';

export default function Payments() {
  const { payments, currentTeam, players } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  // Get unique months and statuses for filters
  const { months, statuses } = useMemo(() => {
    const uniqueMonths = ['all', ...new Set(payments.map(p => p.month).filter(Boolean))];
    const uniqueStatuses = ['all', ...new Set(payments.map(p => p.status).filter(Boolean))];
    return { months: uniqueMonths, statuses: uniqueStatuses };
  }, [payments]);

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const player = players.find(p => p.id === payment.playerId);
      const playerName = player?.name?.toLowerCase() || '';
      
      const matchesSearch = searchTerm === '' || 
        playerName.includes(searchTerm.toLowerCase()) ||
        payment.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMonth = monthFilter === 'all' || payment.month === monthFilter;
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [payments, players, searchTerm, monthFilter, statusFilter]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setMonthFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm || monthFilter !== 'all' || statusFilter !== 'all';

  if (!currentTeam) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Plus className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No team selected</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please select or create a team to manage payments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage payments for {currentTeam.name}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center group"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Record Payment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by player name, month, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Month Filter */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="all">All Months</option>
            {months.filter(m => m !== 'all').map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="all">All Statuses</option>
            {statuses.filter(s => s !== 'all').map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Results Count and Clear Filters */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {filteredPayments.length} of {payments.length} payment records
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
            <Plus className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {payments.length === 0 ? 'No payments recorded yet' : 'No payments found'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            {payments.length === 0 
              ? 'Start tracking player payments including monthly dues, court fees, and other contributions.'
              : 'No payments match your current filters. Try adjusting your search criteria.'
            }
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Record Your First Payment
          </button>
        </div>
      ) : (
        <PaymentTable payments={filteredPayments} onEdit={handleEdit} />
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}