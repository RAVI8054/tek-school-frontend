let API_BASE = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE) {
  if (import.meta.env.PROD) {
    console.error('CRITICAL: VITE_API_BASE_URL environment variable is missing in production!');
    // Prevents silently calling localhost in production
    API_BASE = '/api/v1'; // Fallback to relative path which is safer than localhost
  } else {
    API_BASE = 'http://localhost:8000/api/v1';
  }
}

/**
 * Helper to make API requests with credentials (cookies) included.
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Dynamically dispatch based on current route
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      } else {
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

let refreshPromise = null;

/**
 * Refresh auth token for any user (relies on httpOnly cookie)
 */
export async function refreshAuthToken() {
  if (refreshPromise) return refreshPromise;
  
  refreshPromise = fetchApi(`/auth/refresh-token`, {
    method: 'POST',
  }).finally(() => {
    refreshPromise = null;
  });
  
  return refreshPromise;
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
 * Forgot password (Student)
 */
export async function forgotPassword(email) {
  return fetchApi(`/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

/**
 * Reset password (Student)
 */
export async function resetPassword(token, password, passwordConfirm) {
  return fetchApi(`/auth/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify({ token, password, passwordConfirm })
  });
}

/**
 * Register a new student (Admin only)
 */
export async function registerStudent(data) {
  return fetchApi(`/auth/student`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Fetch all students (Admin only)
 */
export async function getStudents() {
  return fetchApi('/auth/student', { method: 'GET' });
}

export async function updateStudentAdmin(id, data) {
  return fetchApi(`/auth/student/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function deleteStudentAdmin(id) {
  return fetchApi(`/auth/student/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Register a new instructor (Admin only)
 */
export async function registerInstructor(data) {
  return fetchApi(`/auth/instructor`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Fetch all instructors (Admin only)
 */
export async function getInstructors() {
  return fetchApi(`/auth/instructor`);
}

/**
 * Delete an instructor (Admin only)
 */
export async function deleteInstructorAdmin(id) {
  return fetchApi(`/auth/instructor/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Register a new sales team member (Admin only)
 */
export async function registerSalesTeam(data) {
  return fetchApi(`/auth/salesteam`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Fetch all sales team members (Admin only)
 */
export async function getSalesTeam() {
  return fetchApi(`/auth/salesteam`);
}

/**
 * Update a sales team member (Admin only)
 */
export async function updateSalesTeamAdmin(id, data) {
  return fetchApi(`/auth/salesteam/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * Delete a sales team member (Admin only)
 */
export async function deleteSalesTeamAdmin(id) {
  return fetchApi(`/auth/salesteam/${id}`, {
    method: 'DELETE'
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
 * Create or update a slot for a given date (Admin only).
 * @param {{ date: string, times: string[], label?: string }} data
 */
export async function createSlot(data) {
  return fetchApi(`/enquiry/slots`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get all available (future) slots — public.
 */
export async function getAvailableSlots() {
  return fetchApi(`/enquiry/slots`);
}

/**
 * Get all slots including past dates — Admin only.
 */
export async function getAllSlotsAdmin() {
  return fetchApi(`/enquiry/slots/all`);
}

/**
 * Delete a slot by id (Admin only).
 */
export async function deleteSlot(id) {
  return fetchApi(`/enquiry/slots/${id}`, { method: 'DELETE' });
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

// ============================================================================
// STUDENT COMMUNITY APIs
// ============================================================================

export async function getCommunityChannels(filter = 'discover', search = '') {
  const query = new URLSearchParams();
  if (filter) query.append('filter', filter);
  if (search) query.append('search', search);
  return fetchApi(`/student/community/channels?${query.toString()}`);
}

export async function createCommunityChannel(data) {
  return fetchApi(`/student/community/channels`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function joinCommunityChannel(channelId) {
  return fetchApi(`/student/community/channels/join`, {
    method: 'POST',
    body: JSON.stringify({ channelId })
  });
}

export async function deleteCommunityChannel(channelId) {
  return fetchApi(`/student/community/channels/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ channelId })
  });
}

export async function getChannelMessages(channelId, limit = 20, offset = 0) {
  const query = new URLSearchParams({ channelId, limit, offset });
  return fetchApi(`/student/community/channels/messages?${query.toString()}`);
}

export async function sendChannelMessage(data) {
  // data = { channelId, content, parentMessageId }
  return fetchApi(`/student/community/channels/messages`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function reactToChannelMessage(messageId, action) {
  return fetchApi(`/student/community/messages/react`, {
    method: 'POST',
    body: JSON.stringify({ messageId, action })
  });
}

// ============================================================================
// ADMIN COMMUNITY APIs
// ============================================================================

export async function getAdminCommunityChannels(search = '', page = 1, limit = 10) {
  const query = new URLSearchParams({ page, limit });
  if (search) query.append('search', search);
  return fetchApi(`/admin/community/channels?${query.toString()}`);
}

export async function getAdminChannelMessages(channelId) {
  return fetchApi(`/admin/community/channels/${channelId}/messages`);
}

export async function editAdminCommunityChannel(channelId, data) {
  return fetchApi(`/admin/community/channels/edit`, {
    method: 'PUT',
    body: JSON.stringify({ channelId, ...data })
  });
}

export async function deleteAdminCommunityChannel(channelId) {
  return fetchApi(`/admin/community/channels/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ channelId })
  });
}

export async function deleteAdminCommunityMessage(messageId) {
  return fetchApi(`/admin/community/messages/${messageId}`, {
    method: 'DELETE'
  });
}

export async function blockAdminCommunityUser(userId, note = '') {
  return fetchApi(`/admin/community/users/block`, {
    method: 'POST',
    body: JSON.stringify({ userId, note })
  });
}

export async function getBlockedStudents() {
  return fetchApi(`/admin/community/users/blocked`);
}

export async function unblockAdminCommunityUser(userId) {
  return fetchApi(`/admin/community/users/unblock`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// ============================================================================
// STUDENT PROFILE APIs
// ============================================================================

export async function getStudentProfile() {
  return fetchApi(`/student/profile`);
}

export async function updateStudentProfile(data) {
  return fetchApi(`/student/profile`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function uploadStudentAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  // Note: For FormData, we must omit the 'Content-Type' header so the browser sets the correct boundary
  const url = `${API_BASE}/student/profile/avatar`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('auth:student_unauthorized'));
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Avatar upload failed with status ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// ADMIN PLACEMENTS APIs
// ============================================================================

export async function getAdminApplications() {
  return fetchApi(`/admin/placements/applications`);
}

export async function updateAdminApplicationStage(id, data) {
  return fetchApi(`/admin/placements/applications/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ id, ...data })
  });
}

export async function getAdminJobs() {
  return fetchApi(`/admin/placements/jobs`);
}

export async function createAdminJob(data) {
  return fetchApi(`/admin/placements/jobs`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAdminJob(id, data) {
  return fetchApi(`/admin/placements/jobs`, {
    method: 'PATCH',
    body: JSON.stringify({ id, ...data })
  });
}

export async function getAdminHiringPartners() {
  return fetchApi(`/admin/placements/partners`);
}

export async function createAdminHiringPartner(data) {
  return fetchApi(`/admin/placements/partners`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// ============================================================================
// STUDENT PLACEMENTS APIs
// ============================================================================

export async function getStudentPlacementProfile() {
  return fetchApi(`/student/placements/profile`);
}

export async function updateStudentPlacementProfile(data) {
  return fetchApi(`/student/placements/profile`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function getStudentJobs() {
  return fetchApi(`/student/placements/jobs`);
}

export async function getStudentApplications() {
  return fetchApi(`/student/placements/applications`);
}

export async function applyStudentJob(jobId) {
  return fetchApi(`/student/placements/applications`, {
    method: 'POST',
    body: JSON.stringify({ jobId })
  });
}

// ============================================================================
// WORKSHOP APIs
// ============================================================================

export async function getWorkshops() {
  return fetchApi(`/workshops`);
}

export async function getWorkshopById(id) {
  return fetchApi(`/workshops/${id}`);
}

export async function createAdminWorkshop(data) {
  return fetchApi(`/workshops`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function bookWorkshop(id, paymentData = {}) {
  return fetchApi(`/workshops/${id}/book`, {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
}

export async function uploadWorkshopImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const url = `${API_BASE}/workshops/upload-image`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Image upload failed with status ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// PAYMENT APIs  (Razorpay)
// ============================================================================

/**
 * Step 1 — Create a pending payment record + Razorpay order on the server.
 *
 * @param {{
 *   paymentFor: 'Course' | 'Workshop' | 'Other',
 *   itemId: string,
 *   amount: number,   // INR (backend converts to paise internally)
 * }} data
 */
export async function initiatePayment({ paymentFor, itemId, amount }) {
  return fetchApi('/payments/initiatepayment', {
    method: 'POST',
    body: JSON.stringify({ paymentFor, itemId, amount, paymentMethod: 'Razorpay' }),
  });
}

/**
 * Step 2 — Verify Razorpay signature server-side after checkout.
 * Always call this before showing a success screen.
 *
 * @param {{
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string,
 *   paymentId: string,   // Our DB Payment._id from initiatePayment response
 * }} data
 */
export async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId }) {
  return fetchApi('/payments/verifypayment', {
    method: 'POST',
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId }),
  });
}



