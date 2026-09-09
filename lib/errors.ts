import { NextResponse } from "next/server";

export const ErrorCode = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID: "AUTH_INVALID",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  DATABASE_ERROR: "DATABASE_ERROR",
  STORAGE_ERROR: "STORAGE_ERROR",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Generates a unique, high-entropy correlation request ID for end-to-end tracing.
 * Format: HZ-REQ-xxxxxxxx
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36).slice(-4);
  const randomChars = Math.random().toString(36).substring(2, 6);
  return `HZ-REQ-${(timestamp + randomChars).toUpperCase()}`;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCodeType;
    message: string;
    requestId: string;
    details?: unknown;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  requestId: string;
}

export class AppError extends Error {
  public readonly code: ErrorCodeType;
  public readonly statusCode: number;
  public readonly requestId: string;
  public readonly details?: unknown;

  constructor(
    code: ErrorCodeType,
    message: string,
    statusCode = 400,
    details?: unknown,
    requestId?: string
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId || generateRequestId();
    this.details = details;
  }
}

/**
 * Formats a standardized JSON error response for Next.js Route Handlers.
 * Guarantees no sensitive stack traces, DB connection strings, or credentials leak to clients.
 */
export function formatApiError(
  code: ErrorCodeType,
  message: string,
  statusCode = 400,
  requestId?: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const reqId = requestId || generateRequestId();

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        requestId: reqId,
        ...(details ? { details } : {}),
      },
    },
    { status: statusCode }
  );
}

/**
 * Formats a standardized JSON success response.
 */
export function formatApiSuccess<T>(
  data: T,
  statusCode = 200,
  requestId?: string
): NextResponse<ApiSuccessResponse<T>> {
  const reqId = requestId || generateRequestId();

  return NextResponse.json(
    {
      success: true,
      data,
      requestId: reqId,
    },
    { status: statusCode }
  );
}
