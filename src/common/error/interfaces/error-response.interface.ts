/**
 * Standard error response structure
 */
export interface ErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}
