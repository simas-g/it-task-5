import {
  getAllUsers,
  updateUsersStatus,
  deleteUsersByIds,
} from "../userModel.js";

export async function getUsers(_req, res) {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Controller Error (getUsers):", error.message);
    return res
      .status(500)
      .json({ message: "Failed to retrieve user list due to a server error." });
  }
}

export async function updateStatus(req, res) {
  const { status, ids } = req.body;
  const newStatus = status.toLowerCase();
  if (!newStatus || (newStatus !== "active" && newStatus !== "blocked")) {
    return res.status(400).json({
      message: "Invalid status. Must be 'active' or 'blocked'.",
    });
  }
  try {
    const success = await updateUsersStatus(ids, newStatus);
    if (success) {
      return res.status(200).json(success);
    } else {
      return res.status(404).json({
        message: `Users with ID [${ids}] not found.`,
      });
    }
  } catch (error) {
    console.error("Controller Error (updateStatus):", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update user status due to a server error." });
  }
}

export async function deleteUsers(req, res) {
  const { ids } = req.body;
  if (!ids) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const success = await deleteUsersByIds(ids);
    if (success) {
      return res.status(200).json({ message: "User succefully deleted" });
    } else {
      return res.status(404).json({
        message: `Users with IDs ${ids} not found.`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error. Try again later." });
  }
}
