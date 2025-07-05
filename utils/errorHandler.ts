/**
 * Custom error handling utility
 */
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): Response {
  console.error('API error:', error);
  
  if (error instanceof AppError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default error response
  return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function catchAsync(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
