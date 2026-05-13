/**
 * lib/api.ts — Shared API response utilities
 *
 * Provides consistent error format and Zod validation helpers
 * for all Next.js API route handlers.
 *
 * Error response shape:
 *   { error: string, field?: string, details?: { field: string; message: string }[] }
 */

import { z, ZodError } from 'zod';
import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiErrorBody {
  error: string;
  field?: string;
  details?: { field: string; message: string }[];
}

// ---------------------------------------------------------------------------
// apiError — build a standard JSON error response
// ---------------------------------------------------------------------------

export function apiError(
  message: string,
  status: number,
  options?: { field?: string; details?: ApiErrorBody['details'] }
): Response {
  const body: ApiErrorBody = { error: message };
  if (options?.field) body.field = options.field;
  if (options?.details) body.details = options.details;
  return Response.json(body, { status });
}

// ---------------------------------------------------------------------------
// Status code shortcuts
// ---------------------------------------------------------------------------

export const HTTP = {
  /** 400 — malformed request body or missing required fields */
  badRequest: (message: string, details?: ApiErrorBody['details']) =>
    apiError(message, 400, { details }),

  /** 401 — unauthenticated */
  unauthorized: (message = 'Not authenticated. Please log in.') =>
    apiError(message, 401),

  /** 403 — authenticated but insufficient permissions */
  forbidden: (message = 'You do not have permission to perform this action.') =>
    apiError(message, 403),

  /** 404 — resource not found */
  notFound: (resource = 'Resource') =>
    apiError(`${resource} not found.`, 404),

  /** 409 — conflict (duplicate resource) */
  conflict: (message: string) => apiError(message, 409),

  /** 422 — semantically invalid (business rule violation) */
  unprocessable: (message: string, field?: string) =>
    apiError(message, 422, { field }),

  /** 423 — locked (account lockout) */
  locked: (message: string) => apiError(message, 423),

  /** 500 — unexpected server error */
  internal: (message = 'An internal server error occurred.') =>
    apiError(message, 500),
} as const;

// ---------------------------------------------------------------------------
// parseBody — safely parse and validate request body with Zod
//
// Returns { data } on success or { response } on failure.
// The caller must check which branch and return `response` early.
// ---------------------------------------------------------------------------

export async function parseBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; response?: never } | { data?: never; response: Response }> {
  // Parse JSON
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      response: HTTP.badRequest('Request body must be valid JSON.'),
    };
  }

  // Validate schema
  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      response: Response.json(
        {
          error: 'Validation failed.',
          details: formatZodErrors(result.error),
        },
        { status: 400 }
      ),
    };
  }

  return { data: result.data };
}

// ---------------------------------------------------------------------------
// parseQueryParams — validate URL search params against a Zod schema
// ---------------------------------------------------------------------------

export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { data: T; response?: never } | { data?: never; response: Response } {
  const raw = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      response: Response.json(
        { error: 'Invalid query parameters.', details: formatZodErrors(result.error) },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}

// ---------------------------------------------------------------------------
// formatZodErrors — convert ZodError into a clean array of field + message
// ---------------------------------------------------------------------------

export function formatZodErrors(
  err: ZodError
): { field: string; message: string }[] {
  return err.errors.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));
}
