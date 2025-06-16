import { NextRequest, NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export function createApiResponse<T>(
  data?: T,
  message?: string,
  success: boolean = true
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(error: string, statusCode: number = 400): NextResponse {
  return NextResponse.json(createApiResponse(null, error, false), { status: statusCode });
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse {
  return NextResponse.json(createApiResponse(data, message), { status: statusCode });
}

export async function withErrorHandling(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      // Handle error silently and return generic error response
      return createErrorResponse(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  };
}

export function validateContentType(
  request: NextRequest,
  expectedType: string = 'application/json'
): boolean {
  const contentType = request.headers.get('content-type');

  return contentType?.includes(expectedType) ?? false;
}

export async function validateJsonBody<T>(request: NextRequest): Promise<T> {
  if (!validateContentType(request)) {
    throw new Error('Content-Type must be application/json');
  }

  try {
    const body = await request.json();

    return body as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}
