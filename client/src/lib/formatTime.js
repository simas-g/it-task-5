import { formatDistanceToNow } from "date-fns";

export function formatRelativeTime(dateInput) {
  if (!dateInput) {
    return "N/A";
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const gmt0Timestamp = Date.UTC(year, month, day, hours, minutes, seconds);
  const gmt0Date = new Date(gmt0Timestamp);
  const relativeTime = formatDistanceToNow(gmt0Date, {
    addSuffix: true,
    includeSeconds: true,
  });

  return relativeTime;
}
