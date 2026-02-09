"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Business, getAllBusinesses } from "@/api/business.api";
import { sendNotification, getSelectedBusinessTokens } from "@/api/notification.api";
import { POCKETBASE_URL } from "@/lib/pocketbase";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

// Helper function to format address object
const formatAddress = (address: Business["address"]) => {
  if (!address || typeof address === 'string') return "-";
  const parts = [
    address.address,
    address.city,
    address.state,
    address.zipcode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ") || "-";
};

// Helper function to format location object
const formatLocation = (location: Business["location"]) => {
  if (!location || typeof location === 'string') return "-";
  return `${location.lat.toFixed(6)}, ${location.long.toFixed(6)}`;
};

// Helper function to format days of operation
const formatDaysOfOperation = (days: Business["days_of_operation"]) => {
  if (!days || typeof days === 'string') return "-";
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const openDays = dayNames.filter(day => days && days[day]);
  if (openDays.length === 0) return "-";
  return openDays.join(', ');
};

// Helper function to format hours of operation
const formatHoursOfOperation = (hours: Business["hours_of_operation"]) => {
  if (!hours || typeof hours === 'string') return "-";
  return String(hours);
};

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [memberFilter, setMemberFilter] = useState<string>("all");
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [notificationSending, setNotificationSending] = useState(false);
  const [notificationResult, setNotificationResult] = useState<{ success: boolean; sent: number; failed: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllBusinesses("-created");
      
      // Check if result has data (not cancelled)
      if (result.success && result.data) {
        setBusinesses(result.data);
      } else if (result.error !== 'Request cancelled') {
        setError(result.error || "Failed to fetch businesses");
      }
    } catch (err) {
      setError("An error occurred while fetching businesses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await fetchBusinesses();
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [fetchBusinesses]);

  // Get unique categories
  // Build unique categories as { id, name } so we can display name but use id as value
  const categoryMap = new Map<string, { id: string; name: string }>();
  businesses.forEach((b) => {
    const cat = b?.expand.category;
    if (!cat) return;
    if (typeof cat === "string") {
      // if category is stored as a string, treat it as both id and name
      if (!categoryMap.has(cat)) categoryMap.set(cat, { id: cat, name: cat });
    } else {
      const id = cat.id;
      const name = cat.name || id;
      if (id && !categoryMap.has(id)) categoryMap.set(id, { id, name });
    }
  });
  const categories = Array.from(categoryMap.values());

  // Filter businesses
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = 
      business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && business.Active) ||
      (statusFilter === "inactive" && !business.Active);
    
    const matchesCategory = categoryFilter === "all" || (typeof business.category === 'string' ? business.category === categoryFilter : business.category?.id === categoryFilter);
    
    const matchesMember = memberFilter === "all" || 
      (memberFilter === "member" && business.isMember) ||
      (memberFilter === "non-member" && !business.isMember);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesMember;
  });

  // Apply sorting
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    const multiplier = direction === 'asc' ? 1 : -1;
    
    switch (key) {
      case 'name':
        return a.business_name.localeCompare(b.business_name) * multiplier;
      case 'rating':
        return (a.average_rating - b.average_rating) * multiplier;
      case 'views':
        return (a.views - b.views) * multiplier;
      default:
        return 0;
    }
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBusinesses(new Set());
    } else {
      setSelectedBusinesses(new Set(filteredBusinesses.map(b => b.id)));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual checkbox
  const handleSelectBusiness = (id: string) => {
    const newSelected = new Set(selectedBusinesses);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBusinesses(newSelected);
    setSelectAll(newSelected.size === filteredBusinesses.length);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sorted businesses

  // Open business details modal
  const openBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  // Open notification dialog
  const openNotificationDialog = () => {
    setNotificationDialogOpen(true);
    setNotificationResult(null);
  };

  // Close notification dialog
  const closeNotificationDialog = () => {
    setNotificationDialogOpen(false);
    setNotificationTitle("");
    setNotificationBody("");
    setNotificationResult(null);
  };

  // Send notification
  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) return;

    setNotificationSending(true);
    
    // Get selected businesses
    const selectedBusinessList = filteredBusinesses.filter(b => selectedBusinesses.has(b.id));
    const tokens = getSelectedBusinessTokens(selectedBusinessList);
    
    if (tokens.length === 0) {
      setNotificationResult({ success: false, sent: 0, failed: 0 });
      setNotificationSending(false);
      return;
    }

    const result = await sendNotification(tokens, {
      title: notificationTitle,
      body: notificationBody,
      data: { type: 'business_notification' },
    });

    setNotificationResult(result);
    setNotificationSending(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success dark:bg-success/20">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger dark:bg-danger/20">
        Inactive
      </span>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Business Owners" />
      
      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="flex h-96 items-center justify-center">
          <div className="rounded-lg bg-danger/10 p-4 text-danger dark:bg-danger/20">
            {error}
          </div>
        </div>
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Business Owners
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and view all registered business owners
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-64"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.16666 3.33332C12.4167 3.33332 15 5.91665 15 9.16665C15 12.4167 12.4167 15 9.16666 15C5.91666 15 3.33332 12.4167 3.33332 9.16665C3.33332 5.91665 5.91666 3.33332 9.16666 3.33332Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 17.5L14.1667 14.1667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="min-w-[150px]">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="min-w-[150px]">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Category
              </label>
              <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
            </div>

            {/* Member Filter */}
            <div className="min-w-[150px]">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Membership
              </label>
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="all">All</option>
                <option value="member">Members</option>
                <option value="non-member">Non-Members</option>
              </select>
            </div>

            {/* Selected count */}
            {selectedBusinesses.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedBusinesses.size} selected
                </span>
                <button
                  onClick={openNotificationDialog}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Send Notification
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Businesses</p>
              <p className="mt-1 text-2xl font-bold text-black dark:text-white">
                {businesses.length}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="mt-1 text-2xl font-bold text-success">
                {businesses.filter((b) => b.Active).length}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="mt-1 text-2xl font-bold text-black dark:text-white">
                {businesses.reduce((acc, b) => acc + b.views, 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
              <p className="mt-1 text-2xl font-bold text-black dark:text-white">
                {businesses.length > 0
                  ? (businesses.reduce((acc, b) => acc + b.average_rating, 0) / businesses.length).toFixed(1)
                  : "0"}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-col">
            <div className="grid rounded-sm bg-gray-2 dark:bg-meta-4" style={{ gridTemplateColumns: '48px 1fr 120px 200px 100px 80px 70px 70px 100px' }}>
              <div className="flex items-center justify-center p-2 xl:p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                />
              </div>
              <div className="p-2.5 xl:p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-sm font-medium uppercase xsm:text-base hover:text-primary"
                >
                  Business
                  {sortConfig?.key === 'name' && (
                    <svg className={`h-4 w-4 transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Owner</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <button
                  onClick={() => handleSort('views')}
                  className="flex items-center justify-center gap-1 text-sm font-medium uppercase xsm:text-base hover:text-primary"
                >
                  Views
                  {sortConfig?.key === 'views' && (
                    <svg className={`h-4 w-4 transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <button
                  onClick={() => handleSort('rating')}
                  className="flex items-center justify-center gap-1 text-sm font-medium uppercase xsm:text-base hover:text-primary"
                >
                  Rating
                  {sortConfig?.key === 'rating' && (
                    <svg className={`h-4 w-4 transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Joined</h5>
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No businesses found
                </p>
              </div>
            ) : (
              sortedBusinesses.map((business, key) => (
                <div
                  className={`grid cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-meta-4 ${
                    key === sortedBusinesses.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  } ${selectedBusinesses.has(business.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                  key={business.id}
                  onClick={() => openBusinessDetails(business)}
                  style={{ gridTemplateColumns: '48px 1fr 120px 200px 100px 80px 70px 70px 100px' }}
                >
                  {/* Checkbox */}
                  <div className="flex items-center justify-center p-2 xl:p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.has(business.id)}
                      onChange={() => handleSelectBusiness(business.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>

                  {/* Business Name & Logo */}
                  <div className="flex items-center gap-3 p-2.5 xl:p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4">
                      {business.display_picture ? (
                        <Image
                          src={`${POCKETBASE_URL}/api/files/${business.collectionId}/${business.id}/${business.display_picture}`}
                          alt={business.business_name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-black dark:text-white">
                          {business.business_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium text-black dark:text-white">
                        {business.business_name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {business.business_type}
                      </p>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="truncate text-sm text-black dark:text-white">
                      {business.owner_name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {business.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {business.phone_number}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    {getStatusBadge(business.Active)}
                  </div>

                  {/* Views */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="text-sm text-black dark:text-white">
                      {business.views.toLocaleString()}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="text-sm text-black dark:text-white">
                        {business.average_rating.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(business.created)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notification Dialog */}
      {notificationDialogOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeNotificationDialog}
          />
          
          {/* Dialog Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-boxdark shadow-xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
                <h3 className="text-lg font-bold text-black dark:text-white">
                  Send Notification
                </h3>
                <button
                  onClick={closeNotificationDialog}
                  className="text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Sending to {selectedBusinesses.size} selected business(es) with FCM tokens.
                </p>
                
                {/* Title Input */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Enter notification title"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                
                {/* Body Input */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Message
                  </label>
                  <textarea
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    placeholder="Enter notification message"
                    rows={3}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                
                {/* Result */}
                {notificationResult && (
                  <div className={`mb-4 rounded-lg p-3 ${notificationResult.success ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    <p className="text-sm">
                      {notificationResult.success
                        ? `Successfully sent to ${notificationResult.sent} device(s)${notificationResult.failed > 0 ? `, ${notificationResult.failed} failed` : ''}`
                        : `Failed to send. Sent: ${notificationResult.sent}, Failed: ${notificationResult.failed}`
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="flex gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
                <button
                  onClick={closeNotificationDialog}
                  className="flex-1 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={notificationSending || !notificationTitle.trim() || !notificationBody.trim()}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {notificationSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Slide-over Modal */}
      {isModalOpen && selectedBusiness && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={closeModal}
          />
          
          {/* Modal Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white dark:bg-boxdark shadow-xl transition-transform">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Business Details
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Profile */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4">
                    {selectedBusiness.display_picture ? (
                      <Image
                        src={`${POCKETBASE_URL}/api/files/${selectedBusiness.collectionId}/${selectedBusiness.id}/${selectedBusiness.display_picture}`}
                        alt={selectedBusiness.business_name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-black dark:text-white">
                        {selectedBusiness.business_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-black dark:text-white">
                      {selectedBusiness.business_name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedBusiness.business_type}
                    </p>
                    {getStatusBadge(selectedBusiness.Active)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-6">
                  {/* Owner Info */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Owner Information
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Owner Name</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.owner_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.phone_number}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Business Information
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {( selectedBusiness.expand.category.name || "-")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Business Type</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.business_type || "-"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatAddress(selectedBusiness.address)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatLocation(selectedBusiness.location)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Contact Information
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Contact Email</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.contact_email || "-"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.website ? (
                            <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {selectedBusiness.website}
                            </a>
                          ) : (
                            "-"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hours & Days */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Operating Hours
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Days of Operation</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatDaysOfOperation(selectedBusiness.days_of_operation)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hours of Operation</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatHoursOfOperation(selectedBusiness.hours_of_operation)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Statistics
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                        <p className="text-lg font-bold text-black dark:text-white">
                          {selectedBusiness.views.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Average Rating</p>
                        <p className="text-lg font-bold text-black dark:text-white">
                          {selectedBusiness.average_rating.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Minutes Visited</p>
                        <p className="text-lg font-bold text-black dark:text-white">
                          {selectedBusiness.minutes_visited}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Member Status</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedBusiness.isMember ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  {selectedBusiness.images && selectedBusiness.images.length > 0 && (
                    <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                      <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                        Business Images
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedBusiness.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={`${POCKETBASE_URL}/api/files/${selectedBusiness.collectionId}/${selectedBusiness.id}/${img}`}
                              alt={`${selectedBusiness.business_name} ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Timeline
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatDate(selectedBusiness.created)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatDate(selectedBusiness.updated)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-stroke px-6 py-4 dark:border-strokedark">
                <button
                  onClick={closeModal}
                  className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default BusinessPage;
