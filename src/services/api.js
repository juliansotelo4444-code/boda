// src/services/api.js
// Cliente HTTP para conectar el frontend de la Boda con el Backend de Node/Express & Neon PostgreSQL

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('boda_jwt_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('boda_jwt_token', token);
    } else {
      localStorage.removeItem('boda_jwt_token');
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[API] Fallo en ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- AUTENTICACIÓN ---
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then((data) => {
      if (data.token) this.setToken(data.token);
      return data;
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- CONFIGURACIÓN DE BODA ---
  getSettings() {
    return this.request('/settings');
  }

  updateSettings(data) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- GESTIÓN DE INVITADOS ---
  getGuests(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/guests${query ? `?${query}` : ''}`);
  }

  createGuest(guestData) {
    return this.request('/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  }

  updateGuest(id, guestData) {
    return this.request(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guestData),
    });
  }

  deleteGuest(id) {
    return this.request(`/guests/${id}`, {
      method: 'DELETE',
    });
  }

  updateInvitationStatus(id, status) {
    return this.request(`/guests/${id}/invitation-status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  // --- MESAS Y PLANO 2D ---
  getTables() {
    return this.request('/tables');
  }

  createTable(tableData) {
    return this.request('/tables', {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
  }

  updateTablePosition(id, posX, posY) {
    return this.request(`/tables/${id}/position`, {
      method: 'PUT',
      body: JSON.stringify({ posX, posY }),
    });
  }

  deleteTable(id) {
    return this.request(`/tables/${id}`, {
      method: 'DELETE',
    });
  }

  // --- CRONOGRAMA DINÁMICO (ITINERARIO DRAG & DROP) ---
  getTimeline() {
    return this.request('/timeline');
  }

  createTimelineEvent(eventData) {
    return this.request('/timeline', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  reorderTimeline(items) {
    // items: [{ id, orderIndex }]
    return this.request('/timeline/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  updateTimelineEvent(id, eventData) {
    return this.request(`/timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  deleteTimelineEvent(id) {
    return this.request(`/timeline/${id}`, {
      method: 'DELETE',
    });
  }

  // --- FINANZAS, GASTOS Y PROVEEDORES ---
  getFinancialSummary() {
    return this.request('/finances/summary');
  }

  createExpense(expenseData) {
    return this.request('/finances/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  updateExpense(id, expenseData) {
    return this.request(`/finances/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  }

  recordPayment(expenseId, paymentData) {
    return this.request(`/finances/expenses/${expenseId}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  createVendor(vendorData) {
    return this.request('/finances/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  }

  // --- HISTORIA Y GALERÍA ---
  getStoryMilestones() {
    return this.request('/story/milestones');
  }

  createStoryMilestone(milestoneData) {
    return this.request('/story/milestones', {
      method: 'POST',
      body: JSON.stringify(milestoneData),
    });
  }

  reorderStoryMilestones(items) {
    return this.request('/story/milestones/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  deleteStoryMilestone(id) {
    return this.request(`/story/milestones/${id}`, {
      method: 'DELETE',
    });
  }

  // --- PÚBLICO (Web de Invitados & RSVP) ---
  getPublicWeddingInfo() {
    return this.request('/public/wedding-info');
  }

  getPublicInvitationByToken(token) {
    return this.request(`/public/rsvp/token/${token}`);
  }

  submitPublicRsvp(rsvpData) {
    return this.request('/public/rsvp/submit', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }
}

export const api = new ApiService();
export default api;
