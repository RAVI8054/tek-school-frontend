const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Helper to make API requests with credentials (cookies) included.
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODZiODdkZjAyMzkyZTQ3Y2YyYmUzZSIsInJvbGUiOiJhZG1pbiIsInNlc3Npb25JZCI6bnVsbCwiaWF0IjoxNzg3ODE5MDg3LCJleHAiOjE3ODg0MjM4ODd9.wroqzmqdltYcGYgcmeYg6-ZAztpQNlT7yFhyXQg3wcw";
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      ...options.headers,
    },
    credentials: 'omit',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch enquiries with filtering.
 * @param {Object} filters - { category, inquiry_type, status, search, page, limit }
 */
export async function getEnquiries(filters = {}) {
  const query = new URLSearchParams();
  
  if (filters.category) query.append('category', filters.category);
  if (filters.inquiry_type) {
    // Map UI tab keys to backend enum values
    const typeMap = {
      'book_demo': 'book demo',
      'talk_counselor': 'talk to counselor',
      'workshop': 'workshop',
      'school': 'school',
      'college': 'college',
      'ai_lab': 'ai lab',
    };
    query.append('inquiry_type', typeMap[filters.inquiry_type] || filters.inquiry_type);
  }
  if (filters.status) query.append('status', filters.status);
  
  return fetchApi(`/enquiry?${query.toString()}`);
}

/**
 * Update an enquiry's details.
 */
export async function updateEnquiryStatus(id, data) {
  return fetchApi(`/enquiry/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * Create a new enquiry (e.g. from the frontend landing pages).
 * @param {Object} data - The enquiry data
 */
export async function createEnquiry(data) {
  return fetchApi(`/enquiry/enquiry`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
