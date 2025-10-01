import { getAllUsers, updateUserStatus } from "../userModel.js";

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
  const targetUserId = parseInt(req.params.id, 10);
  const { status: newStatus } = req.body;
  const currentAdminId = req.user.id;
  if (!newStatus || (newStatus !== "active" && newStatus !== "blocked")) {
    return res.status(400).json({
      message: "Invalid status provided. Must be 'active' or 'blocked'.",
    });
  }
  try {
    const success = await updateUserStatus(targetUserId, newStatus);
    if (success) {
      return res.status(200).json({
        message: `User ${targetUserId} status updated to '${newStatus}' successfully.`,
      });
    } else {
      return res.status(404).json({
        message: `User with ID ${targetUserId} not found.`,
      });
    }
  } catch (error) {
    console.error("Controller Error (updateStatus):", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update user status due to a server error." });
  }
}
