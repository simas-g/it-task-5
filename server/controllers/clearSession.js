export function clearSessionAndBlockCache(res, statusCode, message) {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.clearCookie("jwt");
  return res.status(statusCode).json({ message: message });
}
