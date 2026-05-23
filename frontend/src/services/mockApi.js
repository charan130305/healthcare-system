// HealthConnect Community System - Mock API Service Layer
import {
  initialHospitals,
  initialAwarenessPosts,
  initialComplaints,
  initialAppointments,
  initialEmergencyRequests,
  initialHealthRecords,
  initialVaccinations,
  initialNotifications
} from './mockData';

// Helper to initialize local storage
const initStorage = () => {
  if (!localStorage.getItem('hc_initialized')) {
    localStorage.setItem('hc_hospitals', JSON.stringify(initialHospitals));
    localStorage.setItem('hc_awareness_posts', JSON.stringify(initialAwarenessPosts));
    localStorage.setItem('hc_complaints', JSON.stringify(initialComplaints));
    localStorage.setItem('hc_appointments', JSON.stringify(initialAppointments));
    localStorage.setItem('hc_emergencies', JSON.stringify(initialEmergencyRequests));
    localStorage.setItem('hc_health_records', JSON.stringify(initialHealthRecords));
    localStorage.setItem('hc_vaccinations', JSON.stringify(initialVaccinations));
    localStorage.setItem('hc_notifications', JSON.stringify(initialNotifications));
    
    // Seed default users
    const defaultUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@healthconnect.org',
        fullName: 'Dr. Ramesh Kumar (Director)',
        phone: '+91 98765 43210',
        address: 'Health Secretariat, New Delhi',
        role: 'ROLE_ADMIN'
      },
      {
        id: 2,
        username: 'worker',
        email: 'worker@healthconnect.org',
        fullName: 'Sister Sunita Sharma (ANM)',
        phone: '+91 87654 32109',
        address: 'Community Health Centre, Sector 4',
        role: 'ROLE_HEALTH_WORKER'
      },
      {
        id: 3,
        username: 'citizen',
        email: 'citizen@healthconnect.org',
        fullName: 'Aarav Patel',
        phone: '+91 76543 21098',
        address: 'Vill. Ram Pur, Block B',
        role: 'ROLE_CITIZEN'
      }
    ];
    localStorage.setItem('hc_users', JSON.stringify(defaultUsers));
    localStorage.setItem('hc_initialized', 'true');
  }
};

initStorage();

// Storage getters/setters
const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Delay helper to simulate network lag
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    login: async (username, password) => {
      await delay(500);
      const users = getFromStorage('hc_users');
      // Password check simulated
      const user = users.find(u => u.username === username);
      if (!user) throw new Error('Invalid username or password');
      
      const session = {
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2),
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      };
      localStorage.setItem('hc_session', JSON.stringify(session));
      return session;
    },
    signup: async (signUpData) => {
      await delay(500);
      const users = getFromStorage('hc_users');
      if (users.some(u => u.username === signUpData.username)) {
        throw new Error('Username already taken');
      }
      if (users.some(u => u.email === signUpData.email)) {
        throw new Error('Email already taken');
      }

      let mappedRole = 'ROLE_CITIZEN';
      if (signUpData.role === 'ADMIN') mappedRole = 'ROLE_ADMIN';
      else if (signUpData.role === 'HEALTH_WORKER') mappedRole = 'ROLE_HEALTH_WORKER';

      const newUser = {
        id: users.length + 1,
        username: signUpData.username,
        email: signUpData.email,
        fullName: signUpData.fullName,
        phone: signUpData.phone || '',
        address: signUpData.address || '',
        role: mappedRole
      };

      users.push(newUser);
      saveToStorage('hc_users', users);
      return { message: 'Registration successful' };
    },
    logout: () => {
      localStorage.removeItem('hc_session');
    },
    getCurrentSession: () => {
      return JSON.parse(localStorage.getItem('hc_session')) || null;
    }
  },

  citizen: {
    getAwareness: async () => {
      await delay(200);
      return getFromStorage('hc_awareness_posts');
    },
    getHospitals: async () => {
      await delay(300);
      return getFromStorage('hc_hospitals');
    },
    getAppointments: async () => {
      await delay(300);
      const appointments = getFromStorage('hc_appointments');
      const session = mockApi.auth.getCurrentSession();
      return appointments.filter(a => a.citizenId === session?.id);
    },
    bookAppointment: async (appData) => {
      await delay(400);
      const appointments = getFromStorage('hc_appointments');
      const session = mockApi.auth.getCurrentSession();
      const hospitals = getFromStorage('hc_hospitals');
      const hospital = hospitals.find(h => h.id === Number(appData.hospitalId));

      const newApp = {
        id: appointments.length + 1,
        citizenId: session?.id || 3,
        citizenName: session?.fullName || 'Anonymous Citizen',
        hospitalId: Number(appData.hospitalId),
        hospitalName: hospital ? hospital.name : 'Unknown Health Centre',
        doctorName: appData.doctorName,
        appointmentDate: appData.appointmentDate,
        timeSlot: appData.timeSlot,
        symptoms: appData.symptoms || '',
        status: 'PENDING',
        queueNumber: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date().toISOString()
      };

      appointments.push(newApp);
      saveToStorage('hc_appointments', appointments);
      return newApp;
    },
    getComplaints: async () => {
      await delay(300);
      const complaints = getFromStorage('hc_complaints');
      const session = mockApi.auth.getCurrentSession();
      return complaints.filter(c => c.citizenId === session?.id);
    },
    fileComplaint: async (compData) => {
      await delay(400);
      const complaints = getFromStorage('hc_complaints');
      const session = mockApi.auth.getCurrentSession();

      const newComp = {
        id: complaints.length + 1,
        citizenId: session?.id || 3,
        citizenName: session?.fullName || 'Anonymous Citizen',
        title: compData.title,
        description: compData.description,
        category: compData.category,
        status: 'PENDING',
        priority: compData.priority || 'MEDIUM',
        latitude: compData.latitude || 28.6139,
        longitude: compData.longitude || 77.2090,
        adminResponse: '',
        createdAt: new Date().toISOString()
      };

      complaints.push(newComp);
      saveToStorage('hc_complaints', complaints);
      return newComp;
    },
    getEmergencies: async () => {
      const emergencies = getFromStorage('hc_emergencies');
      const session = mockApi.auth.getCurrentSession();
      return emergencies.filter(e => e.citizenId === session?.id);
    },
    triggerSOS: async (sosData) => {
      await delay(200);
      const emergencies = getFromStorage('hc_emergencies');
      const session = mockApi.auth.getCurrentSession();

      const newSOS = {
        id: emergencies.length + 1,
        citizenId: session?.id || 3,
        citizenName: session?.fullName || 'Anonymous Citizen',
        latitude: sosData.latitude || 28.6139,
        longitude: sosData.longitude || 77.2090,
        contactPhone: sosData.contactPhone,
        description: sosData.description || 'Emergency SOS Alarm Triggered',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        resolvedAt: null
      };

      emergencies.push(newSOS);
      saveToStorage('hc_emergencies', emergencies);

      // Trigger Alert Notifications for workers and admins
      const notifications = getFromStorage('hc_notifications');
      const users = getFromStorage('hc_users');
      users.forEach(u => {
        if (u.role === 'ROLE_HEALTH_WORKER' || u.role === 'ROLE_ADMIN') {
          notifications.push({
            id: notifications.length + 1,
            userId: u.id,
            title: '🔴 EMERGENCY SOS ALARM',
            message: `Emergency reported by ${newSOS.citizenName}. Phone: ${newSOS.contactPhone}. Location: ${newSOS.latitude}, ${newSOS.longitude}`,
            type: 'ALERT',
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      });
      saveToStorage('hc_notifications', notifications);

      return newSOS;
    },
    getHealthRecords: async () => {
      const records = getFromStorage('hc_health_records');
      const session = mockApi.auth.getCurrentSession();
      return records.filter(r => r.citizenId === session?.id);
    },
    getVaccinations: async () => {
      const vaccs = getFromStorage('hc_vaccinations');
      const session = mockApi.auth.getCurrentSession();
      return vaccs.filter(v => v.citizenId === session?.id);
    },
    getNotifications: async () => {
      const notifs = getFromStorage('hc_notifications');
      const session = mockApi.auth.getCurrentSession();
      return notifs.filter(n => n.userId === session?.id);
    },
    markNotificationsRead: async () => {
      const notifs = getFromStorage('hc_notifications');
      const session = mockApi.auth.getCurrentSession();
      const updated = notifs.map(n => n.userId === session?.id ? { ...n, isRead: true } : n);
      saveToStorage('hc_notifications', updated);
      return { success: true };
    }
  },

  worker: {
    getAppointments: async () => {
      await delay(300);
      return getFromStorage('hc_appointments');
    },
    updateAppointmentStatus: async (id, status) => {
      await delay(300);
      const apps = getFromStorage('hc_appointments');
      const index = apps.findIndex(a => a.id === Number(id));
      if (index > -1) {
        apps[index].status = status;
        saveToStorage('hc_appointments', apps);
      }
      return { success: true };
    },
    getComplaints: async () => {
      await delay(300);
      return getFromStorage('hc_complaints');
    },
    updateComplaint: async (id, status, response) => {
      await delay(300);
      const comps = getFromStorage('hc_complaints');
      const index = comps.findIndex(c => c.id === Number(id));
      if (index > -1) {
        comps[index].status = status;
        if (response) comps[index].adminResponse = response;
        saveToStorage('hc_complaints', comps);
      }
      return { success: true };
    },
    addHealthRecord: async (citizenId, recData) => {
      await delay(400);
      const records = getFromStorage('hc_health_records');
      const session = mockApi.auth.getCurrentSession();
      
      const newRec = {
        id: records.length + 1,
        citizenId: Number(citizenId),
        diagnoses: recData.diagnoses,
        prescriptions: recData.prescriptions,
        bloodPressure: recData.bloodPressure,
        heartRate: recData.heartRate,
        notes: recData.notes || '',
        recordedByName: session?.fullName || 'Sister Sunita Sharma (ANM)',
        createdAt: new Date().toISOString()
      };

      records.push(newRec);
      saveToStorage('hc_health_records', records);
      return newRec;
    },
    addVaccination: async (citizenId, vaccData) => {
      await delay(400);
      const vaccs = getFromStorage('hc_vaccinations');
      const session = mockApi.auth.getCurrentSession();

      const newVacc = {
        id: vaccs.length + 1,
        citizenId: Number(citizenId),
        vaccineName: vaccData.vaccineName,
        doseNumber: Number(vaccData.doseNumber),
        status: 'COMPLETED',
        dateAdministered: new Date().toISOString().split('T')[0],
        administeredByName: session?.fullName || 'Sister Sunita (ANM)',
        nextDoseDue: vaccData.nextDoseDue || ''
      };

      vaccs.push(newVacc);
      saveToStorage('hc_vaccinations', vaccs);
      return newVacc;
    },
    getEmergencies: async () => {
      return getFromStorage('hc_emergencies');
    },
    dispatchEmergency: async (id, status) => {
      await delay(300);
      const emergencies = getFromStorage('hc_emergencies');
      const index = emergencies.findIndex(e => e.id === Number(id));
      if (index > -1) {
        emergencies[index].status = status;
        if (status === 'RESOLVED') {
          emergencies[index].resolvedAt = new Date().toISOString();
        }
        saveToStorage('hc_emergencies', emergencies);
      }
      return { success: true };
    },
    createAwareness: async (postData) => {
      await delay(400);
      const posts = getFromStorage('hc_awareness_posts');
      const session = mockApi.auth.getCurrentSession();

      const newPost = {
        id: posts.length + 1,
        title: postData.title,
        content: postData.content,
        category: postData.category,
        imageUrl: postData.imageUrl || 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
        videoUrl: postData.videoUrl || '',
        authorName: session?.fullName || 'Sister Sunita (ANM)',
        createdAt: new Date().toISOString()
      };

      posts.unshift(newPost); // Add at beginning
      saveToStorage('hc_awareness_posts', posts);
      return newPost;
    }
  },

  admin: {
    getUsers: async () => {
      await delay(200);
      return getFromStorage('hc_users');
    },
    updateUserRole: async (id, roleName) => {
      const users = getFromStorage('hc_users');
      const index = users.findIndex(u => u.id === Number(id));
      if (index > -1) {
        users[index].role = 'ROLE_' + roleName.toUpperCase();
        saveToStorage('hc_users', users);
      }
      return { success: true };
    },
    deleteUser: async (id) => {
      const users = getFromStorage('hc_users');
      const filtered = users.filter(u => u.id !== Number(id));
      saveToStorage('hc_users', filtered);
      return { success: true };
    },
    addHospital: async (hospData) => {
      const hospitals = getFromStorage('hc_hospitals');
      const newHosp = {
        id: hospitals.length + 1,
        name: hospData.name,
        address: hospData.address,
        phone: hospData.phone,
        latitude: Number(hospData.latitude),
        longitude: Number(hospData.longitude),
        type: hospData.type,
        specialties: hospData.specialties,
        isEmergencyReady: hospData.isEmergencyReady || false,
        rating: 4.0
      };
      hospitals.push(newHosp);
      saveToStorage('hc_hospitals', hospitals);
      return newHosp;
    },
    updateHospital: async (id, hospData) => {
      const hospitals = getFromStorage('hc_hospitals');
      const index = hospitals.findIndex(h => h.id === Number(id));
      if (index > -1) {
        hospitals[index] = { ...hospitals[index], ...hospData };
        saveToStorage('hc_hospitals', hospitals);
      }
      return { success: true };
    },
    deleteHospital: async (id) => {
      const hospitals = getFromStorage('hc_hospitals');
      const filtered = hospitals.filter(h => h.id !== Number(id));
      saveToStorage('hc_hospitals', filtered);
      return { success: true };
    },
    getAnalytics: async () => {
      await delay(400);
      const users = getFromStorage('hc_users');
      const hospitals = getFromStorage('hc_hospitals');
      const appointments = getFromStorage('hc_appointments');
      const complaints = getFromStorage('hc_complaints');
      const emergencies = getFromStorage('hc_emergencies');

      const pendingComplaints = complaints.filter(c => c.status === 'PENDING').length;
      const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED').length;
      const activeSOS = emergencies.filter(e => e.status === 'PENDING').length;

      return {
        totalUsers: users.length,
        totalHospitals: hospitals.length,
        totalAppointments: appointments.length,
        totalComplaints: complaints.length,
        totalSOSAlerts: emergencies.length,
        pendingComplaints,
        resolvedComplaints,
        activeSOSAlerts: activeSOS,
        diseaseTrends: [
          { name: 'Malaria', cases: 24 },
          { name: 'Dengue', cases: 45 },
          { name: 'Influenza', cases: 78 },
          { name: 'Waterborne', cases: 15 }
        ],
        regionalStats: [
          { region: 'Rampur Village', citizens: 120, cases: 12 },
          { region: 'Sujanpur', citizens: 85, cases: 8 },
          { region: 'Gopalganj', citizens: 210, cases: 23 },
          { region: 'Fatehpur', citizens: 95, cases: 5 }
        ]
      };
    },
    broadcast: async (title, message) => {
      await delay(500);
      const notifications = getFromStorage('hc_notifications');
      const users = getFromStorage('hc_users');
      
      users.forEach(u => {
        notifications.push({
          id: notifications.length + 1,
          userId: u.id,
          title: `📢 GLOBAL BROADCAST: ${title}`,
          message,
          type: 'CAMPAIGN',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      });
      
      saveToStorage('hc_notifications', notifications);
      return { message: 'Broadcast successful' };
    }
  }
};
