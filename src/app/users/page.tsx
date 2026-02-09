"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { User, getAllUsers } from "@/api/users.api";
import { sendNotification, getSelectedUserTokens } from "@/api/notification.api";
import { POCKETBASE_URL } from "@/lib/pocketbase";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [notificationSending, setNotificationSending] = useState(false);
  const [notificationResult, setNotificationResult] = useState<{ success: boolean; sent: number; failed: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllUsers("-created");
      
      // Check if result has data (not cancelled)
      if (result.success && result.data) {
        setUsers(result.data);
      } else if (result.error !== 'Request cancelled') {
        setError(result.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await fetchUsers();
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [fetchUsers]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === "all" || user.gender === genderFilter;
    
    return matchesSearch && matchesGender;
  });

  // Apply sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    const multiplier = direction === 'asc' ? 1 : -1;
    
    switch (key) {
      case 'name':
        return a.Name.localeCompare(b.Name) * multiplier;
      case 'email':
        return a.email.localeCompare(b.email) * multiplier;
      default:
        return 0;
    }
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual checkbox
  const handleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === filteredUsers.length);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Apply sorting

  // Open user details modal
  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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

    // Get FCM tokens from selected users
    const selectedUsersArray = users.filter(u => selectedUsers.has(u.id));
    const tokens = getSelectedUserTokens(selectedUsersArray);

    if (tokens.length === 0) {
      setNotificationResult({ success: false, sent: 0, failed: 0 });
      setNotificationSending(false);
      return;
    }

    const result = await sendNotification(tokens, {
      title: notificationTitle,
      body: notificationBody,
      data: { type: 'user_notification' },
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

  const getGenderBadge = (gender: string) => {
    const genderColors: Record<string, string> = {
      Male: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      Female: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          genderColors[gender] || "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
        }`}
      >
        {gender}
      </span>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />
      
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
                Users
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and view all registered users
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
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
            {/* Gender Filter */}
            <div className="min-w-[150px]">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Gender
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Selected count */}
            {selectedUsers.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUsers.size} selected
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-black dark:text-white">
                {users.length}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Male</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {users.filter((u) => u.gender === "Male").length}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Female</p>
              <p className="mt-1 text-2xl font-bold text-pink-600">
                {users.filter((u) => u.gender === "Female").length}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent Signups</p>
              <p className="mt-1 text-2xl font-bold text-success">
                {users.filter((u) => {
                  const createdDate = new Date(u.created);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return createdDate > weekAgo;
                }).length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-col">
            <div className="grid rounded-sm bg-gray-2 dark:bg-meta-4" style={{ gridTemplateColumns: '48px 1fr 200px 120px 100px 100px 120px' }}>
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
                  User
                  {sortConfig?.key === 'name' && (
                    <svg className={`h-4 w-4 transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center justify-center gap-1 text-sm font-medium uppercase xsm:text-base hover:text-primary"
                >
                  Email
                  {sortConfig?.key === 'email' && (
                    <svg className={`h-4 w-4 transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Gender</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Date of Birth</h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Joined</h5>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            ) : (
              sortedUsers.map((user, key) => (
                <div
                  className={`grid cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-meta-4 ${
                    key === sortedUsers.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  } ${selectedUsers.has(user.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                  key={user.id}
                  onClick={() => openUserDetails(user)}
                  style={{ gridTemplateColumns: '48px 1fr 200px 120px 100px 100px 120px' }}
                >
                  {/* Checkbox */}
                  <div className="flex items-center justify-center p-2 xl:p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>

                  {/* User Name & Avatar */}
                  <div className="flex items-center gap-3 p-2.5 xl:p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4">
                      {user.profile_picture ? (
                        <Image
                          src={`${POCKETBASE_URL}/api/files/${user.collectionId}/${user.id}/${user.profile_picture}`}
                          alt={user.Name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-black dark:text-white">
                          {user.Name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium text-black dark:text-white">
                        {user.Name}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.phone || "-"}
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    {getGenderBadge(user.gender || "-")}
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.dateOfBirth
                        ? formatDate(user.dateOfBirth)
                        : "-"}
                    </p>
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center justify-center p-2.5 xl:p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.created)}
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
                  Sending to {selectedUsers.size} selected user(s) with FCM tokens.
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
      {isModalOpen && selectedUser && (
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
                  User Details
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
                    {selectedUser.profile_picture ? (
                      <Image
                        src={`${POCKETBASE_URL}/api/files/${selectedUser.collectionId}/${selectedUser.id}/${selectedUser.profile_picture}`}
                        alt={selectedUser.Name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-black dark:text-white">
                        {selectedUser.Name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-black dark:text-white">
                      {selectedUser.Name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedUser.email}
                    </p>
                    {getGenderBadge(selectedUser.gender || "-")}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Personal Information
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedUser.Name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedUser.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedUser.phone || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedUser.gender || "-"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedUser.dateOfBirth
                            ? formatDate(selectedUser.dateOfBirth)
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                    <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                      Account Timeline
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatDate(selectedUser.created)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {formatDate(selectedUser.updated)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FCM Token */}
                  {selectedUser.fcm && (
                    <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                      <h5 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
                        Push Notifications
                      </h5>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">FCM Token</p>
                        <p className="text-xs font-mono text-black dark:text-white break-all">
                          {selectedUser.fcm.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  )}
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

export default UsersPage;
