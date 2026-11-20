/**
 * Centralized API configuration for BookNook frontend.
 * API URL defaults to localhost:5000 in development, configurable via NEXT_PUBLIC_API_URL.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
