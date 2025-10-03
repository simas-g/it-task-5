import { formatDistanceToNow } from "date-fns";

export function formatRelativeTime(dateInput) {
  if (!dateInput) {
    return "N/A";
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const gmt0Timestamp = Date.UTC(year, month, day, hours, minutes, seconds);
  const gmt0Date = new Date(gmt0Timestamp);
  const relativeTime = formatDistanceToNow(gmt0Date, {
    addSuffix: true,
    includeSeconds: true,
  });
  return relativeTime;
}
