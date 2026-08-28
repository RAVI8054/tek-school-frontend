const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Helper to make API requests with credentials (cookies) included.
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Dynamically get the token based on current route
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = isAdminRoute 
    ? localStorage.getItem('tek_admin_token') 
    : localStorage.getItem('tek_student_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'omit',
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (isAdminRoute) {
        localStorage.removeItem('tek_admin_token');
        localStorage.removeItem('tek_admin_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      } else {
        localStorage.removeItem('tek_student_token');
        localStorage.removeItem('tek_student_user');
        window.dispatchEvent(new Event('auth:student_unauthorized'));
      }
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Login admin user
 */
export async function loginAdmin(credentials) {
  // Credentials should be { email, password }. Omit clientType for admin.
  return fetchApi(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

/**
 * Logout admin user
 */
export async function logoutAdmin() {
  return fetchApi(`/auth/logout`, {
    method: 'POST',
  });
}

/**
 * Login student user
 */
export async function loginStudent(credentials) {
  return fetchApi(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ ...credentials, clientType: 'studentPanel' })
  });
}

/**
 * Logout student user
 */
export async function logoutStudent() {
  return fetchApi(`/auth/logout`, {
    method: 'POST',
  });
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
export async function createEnquiry(data, options = {}) {
  return fetchApi(`/enquiry/enquiry`, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
}
