"use client";
import React from "react";
import DashboardStats from "./DashboardStats";

const AdminDashboard: React.FC = () => {
  return (
    <>
      <DashboardStats />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
          Dashboard Overview
        </h4>
        <p className="text-body dark:text-bodydark">
          Welcome to the UTDA Admin Dashboard. Use the navigation menu to manage companies, addresses, people, and projects.
        </p>
        
        <div className="m-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a href="/companies" className="rounded-sm border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4 hover:shadow-md transition-shadow duration-300">
            <div className="text-center">
          <h5 className="text-lg font-semibold text-black dark:text-white">Companies</h5>
          <p className="text-sm text-body dark:text-bodydark">Manage business entities</p>
            </div>
          </a>
          
          <a href="/addresses" className="rounded-sm border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4 hover:shadow-md transition-shadow duration-300">
            <div className="text-center">
          <h5 className="text-lg font-semibold text-black dark:text-white">Addresses</h5>
          <p className="text-sm text-body dark:text-bodydark">Location information</p>
            </div>
          </a>
          
          <a href="/people" className="rounded-sm border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4 hover:shadow-md transition-shadow duration-300">
            <div className="text-center">
          <h5 className="text-lg font-semibold text-black dark:text-white">People</h5>
          <p className="text-sm text-body dark:text-bodydark">Individual contacts</p>
            </div>
          </a>
          
          <a href="/projects" className="rounded-sm border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4 hover:shadow-md transition-shadow duration-300">
            <div className="text-center">
          <h5 className="text-lg font-semibold text-black dark:text-white">Projects</h5>
          <p className="text-sm text-body dark:text-bodydark">Active initiatives</p>
            </div>
          </a>
        </div>
        
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
