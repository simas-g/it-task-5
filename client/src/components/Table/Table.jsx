import React, { useState } from "react";
import { Trash, Lock, Unlock } from "lucide-react";

const USER_COLUMNS = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Status", accessor: "status" },
  { header: "Registered", accessor: "created_at", isDate: true },
  { header: "Last Active", accessor: "last_login_time", isDate: true },
];

const renderStatusBadge = (status) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  switch (status?.toLowerCase()) {
    case "active":
    case "admin":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          {status}
        </span>
      );
    case "blocked":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          {status}
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>
      );
  }
};

function UserActionsToolbar({ selectedCount }) {
  const isSelectionDisabled = selectedCount === 0;

  const buttonClass = (disabled, isIcon = false) => `
        flex items-center justify-center p-2 rounded-md transition duration-150
        ${isIcon ? "w-10 h-10" : "px-4 h-10"}
        ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
        }
    `;

  const handleGlobalDeleteUnverified = () => {
    alert("Deleting all unverified users (global action)...");
  };

  const handleBulkAction = (action) => {
    if (isSelectionDisabled) return;
    alert(
      `${action} action performed on ${selectedCount} user(s): [${Array.from(
        selectedUsers
      ).join(", ")}]`
    );
  };

  return (
    <div className="bg-white p-3 border-b border-gray-200 shadow-sm rounded-t-lg flex justify-between items-center flex-wrap gap-2">
      <h3 className="text-sm font-semibold text-gray-700 mr-4">
        {selectedCount} User(s) Selected
      </h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleBulkAction("Block")}
          disabled={isSelectionDisabled}
          className={buttonClass(isSelectionDisabled)}
        >
          <Lock size={16} className="mr-1" />
          Block
        </button>
        <button
          onClick={() => handleBulkAction("Unblock")}
          disabled={isSelectionDisabled}
          className={buttonClass(isSelectionDisabled, true)}
        >
          <Unlock size={20} />
        </button>
        <button
          onClick={() => handleBulkAction("Delete")}
          disabled={isSelectionDisabled}
          className={buttonClass(isSelectionDisabled, true)
            .replace("bg-indigo", "bg-red")
            .replace("hover:bg-indigo", "hover:bg-red")}
        >
          <Trash size={20} />
        </button>
        <button
          onClick={handleGlobalDeleteUnverified}
          className={buttonClass(false, true)
            .replace("bg-indigo", "bg-yellow-500")
            .replace("hover:bg-indigo", "hover:bg-yellow-600")}
          title="Delete all unverified users"
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) {
    return "N/A";
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 0) {
    return "Just now";
  }

  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const MONTH = 2592000;
  const YEAR = 31536000;
  if (seconds < 10) {
    return "Just now";
  }
  if (seconds < MINUTE) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / MINUTE);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(seconds / HOUR);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(seconds / DAY);
  if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(seconds / MONTH);
  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(seconds / YEAR);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
export default function UserTable({ users, isLoading, error }) {
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 bg-white rounded-lg shadow-md">
        <p className="text-lg text-indigo-600">Loading user data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p>Error: Failed to load users. {error.message}</p>
      </div>
    );
  }
  if (!users || users.length === 0) {
    return (
      <p className="text-gray-500 p-4 bg-white rounded-lg shadow-md">
        No registered users found.
      </p>
    );
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allUserIds = new Set(users.map((u) => u.id));
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers(new Set());
    }
  };

  const isAllSelected = selectedUsers.size === users.length && users.length > 0;
  const isIndeterminate = selectedUsers.size > 0 && !isAllSelected;

  const desktopTable = (
    <div className="hidden lg:block shadow-xl rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => el && (el.indeterminate = isIndeterminate)}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </th>
              {USER_COLUMNS.map((column) => (
                <th
                  key={column.header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-indigo-50 transition duration-150 ${
                  selectedUsers.has(user.id) ? "bg-indigo-100" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                {USER_COLUMNS.map((column) => {
                  const value = user[column.accessor];
                  let content;

                  if (column.accessor === "status") {
                    content = renderStatusBadge(value);
                  } else if (column.accessor === "last_login_time") {
                    content = formatRelativeTime(value);
                  } else if (column.accessor === "created_at") {
                    content = value.split("T")[0];
                  } else {
                    content = value;
                  }

                  return (
                    <td
                      key={column.accessor}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const mobileCards = (
    <div className="lg:hidden space-y-4">
      <div className="bg-white p-4 border border-gray-300 shadow-sm rounded-lg flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => el && (el.indeterminate = isIndeterminate)}
            onChange={handleSelectAll}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <span>Select All</span>
        </label>
        <span className="text-sm font-semibold text-indigo-600">
          {selectedUsers.size} Selected
        </span>
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className={`bg-white p-4 shadow rounded-lg border transition duration-150 ${
            selectedUsers.has(user.id)
              ? "border-indigo-500 ring-2 ring-indigo-50"
              : "border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start border-b pb-2 mb-2">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedUsers.has(user.id)}
                onChange={() => handleSelectUser(user.id)}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h3>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-gray-500">Email:</dt>
            <dd className="text-gray-900 truncate">{user.email}</dd>

            <dt className="text-gray-500">Status:</dt>
            <dd className="text-gray-900">{renderStatusBadge(user.status)}</dd>

            <dt className="text-gray-500">Registered:</dt>
            <dd className="text-gray-900">{user.created_at}</dd>

            <dt className="text-gray-500">Last Active:</dt>
            <dd className="text-gray-900">{user.last_login_time}</dd>
          </dl>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <UserActionsToolbar selectedCount={selectedUsers.size} />
      {desktopTable}
      {mobileCards}
    </div>
  );
}
