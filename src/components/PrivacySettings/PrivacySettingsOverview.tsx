"use client";

import React from 'react';
import { PrivacySetting } from '@/types/company';

interface PrivacySettingsOverviewProps {
  privacySettings: PrivacySetting[];
}

const PrivacySettingsOverview: React.FC<PrivacySettingsOverviewProps> = ({ privacySettings }) => {
  // Calculate statistics
  const totalSettings = privacySettings.length;
  const onlinePrivateCount = privacySettings.filter(ps => ps.is_private_online).length;
  const publicationPrivateCount = privacySettings.filter(ps => ps.is_private_publication).length;
  const fullyPrivateCount = privacySettings.filter(ps => ps.is_private_online && ps.is_private_publication).length;
  const fullyPublicCount = privacySettings.filter(ps => !ps.is_private_online && !ps.is_private_publication).length;

  // Entity type breakdown
  const entityBreakdown = privacySettings.reduce((acc, ps) => {
    if (!acc[ps.entity_type]) {
      acc[ps.entity_type] = {
        total: 0,
        online_private: 0,
        publication_private: 0,
        fully_private: 0
      };
    }
    acc[ps.entity_type].total++;
    if (ps.is_private_online) acc[ps.entity_type].online_private++;
    if (ps.is_private_publication) acc[ps.entity_type].publication_private++;
    if (ps.is_private_online && ps.is_private_publication) acc[ps.entity_type].fully_private++;
    return acc;
  }, {} as Record<string, { total: number; online_private: number; publication_private: number; fully_private: number }>);

  const StatCard = ({ title, value, description, color = "blue" }: { 
    title: string; 
    value: number; 
    description: string; 
    color?: string;
  }) => (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4`}>
        <svg
          className={`fill-primary dark:fill-white`}
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 0C8.2 0 6 2.2 6 5C6 7.8 8.2 10 11 10C13.8 10 16 7.8 16 5C16 2.2 13.8 0 11 0ZM11 8C9.3 8 8 6.7 8 5C8 3.3 9.3 2 11 2C12.7 2 14 3.3 14 5C14 6.7 12.7 8 11 8Z"
            fill=""
          />
          <path
            d="M21 11H15C14.4 11 14 11.4 14 12V15C14 15.6 14.4 16 15 16H21C21.6 16 22 15.6 22 15V12C22 11.4 21.6 11 21 11ZM20 14H16V13H20V14Z"
            fill=""
          />
          <path
            d="M7 11H1C0.4 11 0 11.4 0 12V15C0 15.6 0.4 16 1 16H7C7.6 16 8 15.6 8 15V12C8 11.4 7.6 11 7 11ZM6 14H2V13H6V14Z"
            fill=""
          />
        </svg>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {value}
          </h4>
          <span className="text-sm font-medium">{title}</span>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <StatCard
          title="Total Settings"
          value={totalSettings}
          description="Total privacy rules configured"
        />
        <StatCard
          title="Online Private"
          value={onlinePrivateCount}
          description="Fields hidden from website"
          color="red"
        />
        <StatCard
          title="Publication Private"
          value={publicationPrivateCount}
          description="Fields excluded from publications"
          color="orange"
        />
        <StatCard
          title="Fully Private"
          value={fullyPrivateCount}
          description="Fields with both privacy types"
          color="purple"
        />
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Privacy Distribution
            </h3>
          </div>
          <div className="p-6.5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fully Public</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(fullyPublicCount / totalSettings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-black dark:text-white">{fullyPublicCount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Online Only</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${((onlinePrivateCount - fullyPrivateCount) / totalSettings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-black dark:text-white">{onlinePrivateCount - fullyPrivateCount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Publication Only</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${((publicationPrivateCount - fullyPrivateCount) / totalSettings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-black dark:text-white">{publicationPrivateCount - fullyPrivateCount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fully Private</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(fullyPrivateCount / totalSettings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-black dark:text-white">{fullyPrivateCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Type Breakdown */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Privacy by Entity Type
            </h3>
          </div>
          <div className="p-6.5">
            <div className="space-y-4">
              {Object.entries(entityBreakdown).map(([entityType, stats]) => (
                <div key={entityType} className="border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-black dark:text-white capitalize">
                      {entityType}
                    </span>
                    <span className="text-sm text-gray-500">
                      {stats.total} total
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-blue-600 font-medium">{stats.online_private}</div>
                      <div className="text-gray-500">Online</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-600 font-medium">{stats.publication_private}</div>
                      <div className="text-gray-500">Publication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-medium">{stats.fully_private}</div>
                      <div className="text-gray-500">Both</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsOverview;
