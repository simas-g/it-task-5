import { deleteUsers } from "../../lib/deleteUser";
import { updateStatus } from "../../lib/updateUserStatus";
import { Trash, Lock, Unlock } from "lucide-react";

export default function UserActionsToolbar({
  selectedUsers,
  selectedCount,
  notifyUser,
  onSuccess,
}) {
  const isSelectionDisabled = selectedCount === 0;
  const buttonClass = (disabled, isIcon = false) => `
        flex items-center justify-center p-2 rounded-md transition duration-150
        ${isIcon ? "w-10 h-10" : "px-4 h-10"}
        ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
        }
    `;
  const handleBulkAction = async (action) => {
    let type = "success";
    if (isSelectionDisabled) return;
    const users = Array.from(selectedUsers);
    try {
      let message;
      let res;
      let targetStatus;
      if (action === "Block") {
        targetStatus = "Blocked";
        res = await updateStatus(users, targetStatus);
      } else if (action === "Unblock") {
        targetStatus = "Active";
        res = await updateStatus(users, targetStatus);
      } else if (action === "Delete") {
        targetStatus = "Deleted";
        res = await deleteUsers(users);
      }
      const affectedCount = res.affectedRows;
      const requestedCount = res.totalRequested || users.length;

      if (affectedCount > 0) {
        const actionVerb =
          action === "Delete" ? "deleted" : action.toLowerCase() + "ed";
        if (affectedCount === requestedCount) {
          message = `Successfully ${actionVerb} all ${requestedCount} user(s).`;
        } else {
          const skippedCount = requestedCount - affectedCount;
          const statusDetail =
            action === "Delete"
              ? ""
              : ` (${skippedCount} already ${targetStatus.toLowerCase()})`;

          message = `Successfully ${actionVerb} ${affectedCount} user(s).${statusDetail}`;
        }
      } else {
        if (action === "Delete") {
          message = `None of the selected user(s) could be deleted.`;
        } else {
          message = `All ${requestedCount} selected user(s) are already ${targetStatus.toLowerCase()}. No changes were made.`;
        }
      }
      if (res.message) {
        message = res.message;
        type = "error";
      }
      notifyUser(message, type);
    } catch (error) {
      const errorMessage = error.message || `Operation failed for ${action}.`;
      console.log("nigeris");
      notifyUser(errorMessage, "error");
    } finally {
      onSuccess();
    }
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
            .replace(/bg-indigo-600/g, "bg-red-400")
            .replace(/hover:bg-indigo-700/g, "hover:bg-red-500")}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}
