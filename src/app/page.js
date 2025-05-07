'use client'

import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  DocumentPlusIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const STATUS_COLORS = {
  paid: 'bg-green-50 hover:bg-green-100',
  pending: 'bg-yellow-50 hover:bg-yellow-100',
  overdue: 'bg-red-50 hover:bg-red-100'
};

const STATUS_BADGE_COLORS = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800'
};

const STATUS_ICONS = {
  paid: CheckCircleIcon,
  pending: ClockIcon,
  overdue: ExclamationCircleIcon
};

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const scanInvoice = useCallback(() => {
    const newInvoice = {
      id: Date.now(),
      client: `Client ${invoices.length + 1}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Service rendered',
      status: 'pending'
    };
    setInvoices((prev) => [...prev, newInvoice]);
  }, [invoices]);

  const addInvoice = useCallback(() => {
    const newInvoice = {
      id: Date.now(),
      client: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: '',
      status: 'pending'
    };
    setSelectedInvoice(newInvoice);
    setIsAddModalOpen(true);
  }, []);

  const openModal = (invoice) => {
    setSelectedInvoice({ ...invoice });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
    setIsAddModalOpen(false);
  };

  const updateInvoice = () => {
    if (isAddModalOpen) {
      setInvoices((prev) => [...prev, selectedInvoice]);
    } else {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === selectedInvoice.id ? selectedInvoice : inv))
      );
    }
    closeModal();
  };

  const deleteInvoice = () => {
    if (window.confirm('Delete this invoice?')) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== selectedInvoice.id));
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setIsSortMenuOpen(false);
  };

  const getSortLabel = (key) => {
    const labels = {
      client: 'Client Name',
      amount: 'Amount',
      date: 'Invoice Date',
      dueDate: 'Due Date',
      status: 'Status'
    };
    return labels[key] || key;
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return sortConfig.direction === 'asc'
      ? a[sortConfig.key].localeCompare(b[sortConfig.key])
      : b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });

  const filteredInvoices = sortedInvoices.filter(invoice =>
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    const Icon = STATUS_ICONS[status];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoice Tracker</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={scanInvoice}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentPlusIcon className="w-5 h-5 mr-2" />
              Scan Invoice
            </button>
            <button
              onClick={addInvoice}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Add Invoice
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search invoices..."
            />
          </div>

          {/* Mobile Sort Menu */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>Sort by: {getSortLabel(sortConfig.key)}</span>
              {sortConfig.direction === 'asc' ? (
                <ArrowUpIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ArrowDownIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isSortMenuOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {['client', 'amount', 'date', 'dueDate', 'status'].map((key) => (
                    <li
                      key={key}
                      onClick={() => handleSort(key)}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <span className="ml-3 block truncate">
                          {getSortLabel(key)}
                        </span>
                        {sortConfig.key === key && (
                          <span className="ml-2 text-blue-600">
                            {sortConfig.direction === 'asc' ? (
                              <ArrowUpIcon className="w-5 h-5" />
                            ) : (
                              <ArrowDownIcon className="w-5 h-5" />
                            )}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Desktop Header - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-2">
              <button
                onClick={() => handleSort('client')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Client
                {sortConfig.key === 'client' && (
                  sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Amount
                {sortConfig.key === 'amount' && (
                  sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleSort('date')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Date
                {sortConfig.key === 'date' && (
                  sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleSort('dueDate')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Due Date
                {sortConfig.key === 'dueDate' && (
                  sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleSort('status')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Status
                {sortConfig.key === 'status' && (
                  sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No invoices found. Add or scan one to start!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <li
                  key={invoice.id}
                  onClick={() => openModal(invoice)}
                  className={`cursor-pointer transition-colors ${STATUS_COLORS[invoice.status]}`}
                >
                  {/* Mobile View */}
                  <div className="sm:hidden p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.client}</p>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_COLORS[invoice.status]}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">${invoice.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{format(new Date(invoice.date), 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due Date</p>
                        <p className="font-medium text-gray-900">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden sm:grid grid-cols-6 gap-4 px-6 py-4">
                    <div className="col-span-2">
                      <p className="font-medium text-gray-900">{invoice.client}</p>
                      <p className="text-sm text-gray-500">{invoice.description}</p>
                    </div>
                    <div className="text-gray-900">${invoice.amount}</div>
                    <div className="text-gray-900">{format(new Date(invoice.date), 'MMM d, yyyy')}</div>
                    <div className="text-gray-900">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_COLORS[invoice.status]}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal */}
        {(isModalOpen || isAddModalOpen) && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md my-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isAddModalOpen ? 'Add Invoice' : 'Edit Invoice'}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    name="client"
                    value={selectedInvoice.client}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={selectedInvoice.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                  <input
                    type="date"
                    name="date"
                    value={selectedInvoice.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={selectedInvoice.dueDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={selectedInvoice.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={selectedInvoice.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Description"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
                {!isAddModalOpen && (
                  <button
                    onClick={deleteInvoice}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                )}
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateInvoice}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isAddModalOpen ? 'Add' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};