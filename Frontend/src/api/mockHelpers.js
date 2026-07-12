/**
 * Mock API helpers — used by all api/*.js files during development.
 * When USE_MOCK is false, functions will use the real apiClient instead.
 *
 * To swap a function to real: change its body from `return mockResponse(data)`
 * to `return apiClient.get('/path')` — no component changes needed.
 */

export const USE_MOCK = false;

/**
 * Simulate network delay
 * @param {number} ms - milliseconds (default 300-600 random)
 */
export function mockDelay(ms) {
  const delay = ms || Math.floor(Math.random() * 300) + 300;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Wrap mock data in the standard response envelope
 */
export async function mockResponse(data, delay) {
  await mockDelay(delay);
  return data;
}

/**
 * Simulate a paginated response
 */
export async function mockPaginatedResponse(items, page = 1, limit = 10) {
  await mockDelay();
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);
  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  };
}

/**
 * Simulate an error response (for testing error states)
 */
export async function mockError(message = 'Something went wrong', status = 500) {
  await mockDelay(200);
  const error = new Error(message);
  error.status = status;
  throw error;
}
