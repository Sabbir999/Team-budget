import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseTable from '../components/expenses/ExpenseTable';
import { Plus, DollarSign, Calendar, Users, Feather, Filter, Search, Home } from 'lucide-react';

export default function Expenses() {
  const { expenses, currentTeam } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.month?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = yearFilter === 'all' || expense.year?.toString() === yearFilter;
      const matchesMonth = monthFilter === 'all' || expense.month === monthFilter;
      
      return matchesSearch && matchesYear && matchesMonth;
    });
  }, [expenses, searchTerm, yearFilter, monthFilter]);

  // Get unique years and months for filters
  const { years, months } = useMemo(() => {
    const uniqueYears = ['all', ...new Set(expenses.map(e => e.year?.toString()).filter(Boolean))];
    const uniqueMonths = ['all', ...new Set(expenses.map(e => e.month).filter(Boolean))];
    return { years: uniqueYears, months: uniqueMonths };
  }, [expenses]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.total || 0), 0);
    const totalIndoorCost = expenses.reduce((sum, exp) => sum + (exp.indoor || 0), 0);
    const totalPlayers = expenses.reduce((sum, exp) => sum + (exp.playersCount || 0), 0);
    const shuttlecockExpenses = expenses.reduce((sum, exp) => sum + (exp.shuttlecock || 0), 0);
    
    return { totalExpenses, totalIndoorCost, totalPlayers, shuttlecockExpenses };
  }, [expenses]);

  if (!currentTeam) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No team selected</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please select or create a team to manage expenses.
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
            Expense Management
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage expenses for {currentTeam.name}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center group"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Add Expense
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Indoor Cost</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalIndoorCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <Feather className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Shuttlecock Costs</p>
              <p className="text-2xl font-bold text-gray-900">${stats.shuttlecockExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl mr-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses by notes or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="all">All Years</option>
            {years.filter(y => y !== 'all').map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

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
        </div>
        
        {/* Results Count */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {filteredExpenses.length} of {expenses.length} expense records
          </span>
          {(searchTerm || yearFilter !== 'all' || monthFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setYearFilter('all');
                setMonthFilter('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
            <DollarSign className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {expenses.length === 0 ? 'No expenses recorded yet' : 'No expenses found'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            {expenses.length === 0 
              ? 'Start tracking your team expenses including court fees, shuttlecock costs, and equipment purchases.'
              : 'No expenses match your current filters. Try adjusting your search criteria.'
            }
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Record Your First Expense
          </button>
        </div>
      ) : (
        <ExpenseTable expenses={filteredExpenses} onEdit={handleEdit} />
      )}

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}