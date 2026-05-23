// HealthConnect API Router (Spring Boot Axios vs Local Mock Fallback)
import axios from 'axios';
import { mockApi } from './mockApi';

const API_BASE_URL = 'http://localhost:8080/api';

// Toggle to force mock API mode (useful for offline demonstration)
const USE_MOCK = true; 

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if JWT token is present
client.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem('hc_session'));
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper wrapper to route queries dynamically
const routeRequest = (endpointCall, mockCall) => {
  if (USE_MOCK) {
    return mockCall();
  }
  return endpointCall();
};

export const api = {
  auth: {
    login: (username, password) => 
      routeRequest(
        () => client.post('/auth/signin', { username, password }).then(res => res.data),
        () => mockApi.auth.login(username, password)
      ),
    signup: (data) => 
      routeRequest(
        () => client.post('/auth/signup', data).then(res => res.data),
        () => mockApi.auth.signup(data)
      ),
    logout: () => {
      mockApi.auth.logout();
    },
    getCurrentUser: () => {
      return mockApi.auth.getCurrentSession();
    }
  },

  citizen: {
    getAwareness: () =>
      routeRequest(
        () => client.get('/citizen/awareness').then(res => res.data),
        () => mockApi.citizen.getAwareness()
      ),
    getHospitals: () =>
      routeRequest(
        () => client.get('/citizen/hospitals').then(res => res.data),
        () => mockApi.citizen.getHospitals()
      ),
    getAppointments: () =>
      routeRequest(
        () => client.get('/citizen/appointments').then(res => res.data),
        () => mockApi.citizen.getAppointments()
      ),
    bookAppointment: (data) =>
      routeRequest(
        () => client.post('/citizen/appointments', data).then(res => res.data),
        () => mockApi.citizen.bookAppointment(data)
      ),
    getComplaints: () =>
      routeRequest(
        () => client.get('/citizen/complaints').then(res => res.data),
        () => mockApi.citizen.getComplaints()
      ),
    fileComplaint: (data) =>
      routeRequest(
        () => client.post('/citizen/complaints', data).then(res => res.data),
        () => mockApi.citizen.fileComplaint(data)
      ),
    getEmergencies: () =>
      routeRequest(
        () => client.get('/citizen/emergency').then(res => res.data),
        () => mockApi.citizen.getEmergencies()
      ),
    triggerSOS: (data) =>
      routeRequest(
        () => client.post('/citizen/emergency', data).then(res => res.data),
        () => mockApi.citizen.triggerSOS(data)
      ),
    getHealthRecords: () =>
      routeRequest(
        () => client.get('/citizen/health-records').then(res => res.data),
        () => mockApi.citizen.getHealthRecords()
      ),
    getVaccinations: () =>
      routeRequest(
        () => client.get('/citizen/vaccinations').then(res => res.data),
        () => mockApi.citizen.getVaccinations()
      ),
    getNotifications: () =>
      routeRequest(
        () => client.get('/citizen/notifications').then(res => res.data),
        () => mockApi.citizen.getNotifications()
      ),
    markNotificationsRead: () =>
      routeRequest(
        () => client.put('/citizen/notifications/read').then(res => res.data),
        () => mockApi.citizen.markNotificationsRead()
      )
  },

  worker: {
    getAppointments: () =>
      routeRequest(
        () => client.get('/worker/appointments').then(res => res.data),
        () => mockApi.worker.getAppointments()
      ),
    updateAppointmentStatus: (id, status) =>
      routeRequest(
        () => client.put(`/worker/appointments/${id}/status?status=${status}`).then(res => res.data),
        () => mockApi.worker.updateAppointmentStatus(id, status)
      ),
    getComplaints: () =>
      routeRequest(
        () => client.get('/worker/complaints').then(res => res.data),
        () => mockApi.worker.getComplaints()
      ),
    updateComplaint: (id, status, response) =>
      routeRequest(
        () => client.put(`/worker/complaints/${id}?status=${status}`, response).then(res => res.data),
        () => mockApi.worker.updateComplaint(id, status, response)
      ),
    addHealthRecord: (citizenId, record) =>
      routeRequest(
        () => client.post(`/worker/health-records?citizenId=${citizenId}`, record).then(res => res.data),
        () => mockApi.worker.addHealthRecord(citizenId, record)
      ),
    addVaccination: (citizenId, record) =>
      routeRequest(
        () => client.post(`/worker/vaccinations?citizenId=${citizenId}`, record).then(res => res.data),
        () => mockApi.worker.addVaccination(citizenId, record)
      ),
    getEmergencies: () =>
      routeRequest(
        () => client.get('/worker/emergency').then(res => res.data),
        () => mockApi.worker.getEmergencies()
      ),
    dispatchEmergency: (id, status) =>
      routeRequest(
        () => client.put(`/worker/emergency/${id}/dispatch?status=${status}`).then(res => res.data),
        () => mockApi.worker.dispatchEmergency(id, status)
      ),
    createAwareness: (data) =>
      routeRequest(
        () => client.post('/worker/awareness', data).then(res => res.data),
        () => mockApi.worker.createAwareness(data)
      )
  },

  admin: {
    getUsers: () =>
      routeRequest(
        () => client.get('/admin/users').then(res => res.data),
        () => mockApi.admin.getUsers()
      ),
    updateUserRole: (id, roleName) =>
      routeRequest(
        () => client.put(`/admin/users/${id}/role?roleName=${roleName}`).then(res => res.data),
        () => mockApi.admin.updateUserRole(id, roleName)
      ),
    deleteUser: (id) =>
      routeRequest(
        () => client.delete(`/admin/users/${id}`).then(res => res.data),
        () => mockApi.admin.deleteUser(id)
      ),
    addHospital: (data) =>
      routeRequest(
        () => client.post('/admin/hospitals', data).then(res => res.data),
        () => mockApi.admin.addHospital(data)
      ),
    updateHospital: (id, data) =>
      routeRequest(
        () => client.put(`/admin/hospitals/${id}`, data).then(res => res.data),
        () => mockApi.admin.updateHospital(id, data)
      ),
    deleteHospital: (id) =>
      routeRequest(
        () => client.delete(`/admin/hospitals/${id}`).then(res => res.data),
        () => mockApi.admin.deleteHospital(id)
      ),
    getAnalytics: () =>
      routeRequest(
        () => client.get('/admin/analytics').then(res => res.data),
        () => mockApi.admin.getAnalytics()
      ),
    broadcast: (title, message) =>
      routeRequest(
        () => client.post(`/admin/broadcast?title=${title}&message=${message}`).then(res => res.data),
        () => mockApi.admin.broadcast(title, message)
      )
  }
};
