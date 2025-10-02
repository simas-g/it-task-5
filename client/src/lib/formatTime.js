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
