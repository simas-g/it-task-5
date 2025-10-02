import React, { useState } from "react";
import { Trash, Lock, Unlock } from "lucide-react";
import { formatRelativeTime } from "../../lib/formatTime";
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

function UserActionsToolbar({ selectedUsers, selectedCount }) {
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
  const handleBulkAction = (action) => {
    if (isSelectionDisabled) return;
    console.log(
      `ACTION: ${action} performed on ${selectedCount} user(s): [${Array.from(
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
          className={buttonClass(isSelectionDisabled, true).replace(
            /indigo/g,
            "red"
          )}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}

export default function UserTable({ users }) {
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  if (!users || users.length === 0) {
    return;
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
