// HealthConnect Community System - Mock Initial Database
export const initialHospitals = [
  {
    id: 1,
    name: 'Apex Community Health Centre',
    address: 'Main Road, Ram Pur Village',
    phone: '+91 11 2345 6789',
    latitude: 28.6139,
    longitude: 77.2090,
    type: 'Government',
    specialties: 'General Medicine, Pediatrics, Maternity Care',
    isEmergencyReady: true,
    rating: 4.2
  },
  {
    id: 2,
    name: 'City General Hospital',
    address: 'Sector 15, Near Metro Station',
    phone: '+91 11 9876 5432',
    latitude: 28.6250,
    longitude: 77.2200,
    type: 'Government',
    specialties: 'Emergency Trauma, Cardiology, Orthopedics, Intensive Care',
    isEmergencyReady: true,
    rating: 4.5
  },
  {
    id: 3,
    name: 'Sanjivani Private Clinic',
    address: 'Bazar Marg, Block C, Ram Pur',
    phone: '+91 99999 88888',
    latitude: 28.6080,
    longitude: 77.1950,
    type: 'Private',
    specialties: 'Dentistry, Dermatology, General Consultations',
    isEmergencyReady: false,
    rating: 3.8
  },
  {
    id: 4,
    name: 'Rural Emergency Clinic',
    address: 'Highway Bypass, Junction 3',
    phone: '+91 11 5555 4444',
    latitude: 28.5950,
    longitude: 77.2300,
    type: 'Government',
    specialties: 'First Aid, Triage, Snakebite & Poison Treatment',
    isEmergencyReady: true,
    rating: 4.0
  }
];

export const initialAwarenessPosts = [
  {
    id: 1,
    title: 'Mega Vaccination Drive for Children',
    content: 'A community-wide vaccination drive for Polio, Measles, and BCG is scheduled for next Monday (June 1st, 2026) at all Primary Health Centres. Parents are requested to bring their child\'s health card. Timing: 9:00 AM to 4:00 PM.',
    category: 'Vaccination',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80',
    videoUrl: '',
    authorName: 'Dr. Ramesh Kumar (Director)',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Preventing Dengue and Malaria This Monsoon',
    content: 'Monsoon is around the corner. Please ensure there is no stagnant water in coolers, flower pots, or open containers around your homes. Use mosquito nets and apply insect repellent regularly. If you experience high fever or body aches, report immediately.',
    category: 'Disease Alert',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    videoUrl: '',
    authorName: 'Sister Sunita Sharma (ANM)',
    createdAt: '2026-05-22T08:30:00Z'
  },
  {
    id: 3,
    title: 'Nutritional Guide for Expecting Mothers',
    content: 'Proper nutrition during pregnancy is crucial for both mother and child. Ensure a rich diet including green leafy vegetables, iron supplements, pulses, dairy products, and fresh fruits. Clean water intake should be at least 3 litres a day.',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    videoUrl: '',
    authorName: 'Dr. Ramesh Kumar (Director)',
    createdAt: '2026-05-18T14:15:00Z'
  }
];

export const initialComplaints = [
  {
    id: 1,
    citizenId: 3,
    citizenName: 'Aarav Patel',
    title: 'Water Contamination in Block B Public Tap',
    description: 'The tap water supplied near Block B public school has been appearing muddy and smells bad for the past three days. Multiple children have reported stomach pain.',
    category: 'Water Contamination',
    status: 'PENDING',
    priority: 'HIGH',
    latitude: 28.6120,
    longitude: 77.2050,
    adminResponse: '',
    createdAt: '2026-05-21T09:12:00Z'
  },
  {
    id: 2,
    citizenId: 3,
    citizenName: 'Aarav Patel',
    title: 'Overflowing Garbage Bin Near Clinic Entrance',
    description: 'The garbage bin right outside the Sanjivani Private Clinic entrance has not been cleared for a week. Strays are scattering waste everywhere, creating a heavy stench and risk of infections.',
    category: 'Sanitation',
    status: 'IN_INVESTIGATION',
    priority: 'MEDIUM',
    latitude: 28.6085,
    longitude: 77.1955,
    adminResponse: 'Assigned local sanitary inspector. Garbage clearance scheduled for tomorrow morning.',
    createdAt: '2026-05-22T11:45:00Z'
  }
];

export const initialAppointments = [
  {
    id: 1,
    citizenId: 3,
    citizenName: 'Aarav Patel',
    hospitalId: 1,
    hospitalName: 'Apex Community Health Centre',
    doctorName: 'Dr. Neha Varma',
    appointmentDate: '2026-05-25',
    timeSlot: '10:00 AM - 10:30 AM',
    symptoms: 'Mild cold symptoms and chronic cough for a week.',
    status: 'PENDING',
    queueNumber: 7,
    createdAt: '2026-05-23T11:00:00Z'
  }
];

export const initialEmergencyRequests = [
  {
    id: 1,
    citizenId: 3,
    citizenName: 'Aarav Patel',
    latitude: 28.6139,
    longitude: 77.2090,
    contactPhone: '+91 76543 21098',
    description: 'Chest pain and breathing difficulty reported.',
    status: 'PENDING',
    createdAt: '2026-05-23T14:30:00Z',
    resolvedAt: null
  }
];

export const initialHealthRecords = [
  {
    id: 1,
    citizenId: 3,
    diagnoses: 'Mild Seasonal Influenza & Dehydration',
    prescriptions: 'Tab Paracetamol 650mg TDS x 3 days, ORS fluid 1L daily, Adequate bed rest',
    bloodPressure: '120/80',
    heartRate: '76 bpm',
    notes: 'Patient advised to return if fever exceeds 102F.',
    recordedByName: 'Sister Sunita Sharma (ANM)',
    createdAt: '2026-05-15T09:30:00Z'
  }
];

export const initialVaccinations = [
  {
    id: 1,
    citizenId: 3,
    vaccineName: 'Hepatitis B',
    doseNumber: 1,
    status: 'COMPLETED',
    dateAdministered: '2026-04-10',
    administeredByName: 'Sister Sunita Sharma (ANM)',
    nextDoseDue: '2026-05-10'
  },
  {
    id: 2,
    citizenId: 3,
    vaccineName: 'Hepatitis B',
    doseNumber: 2,
    status: 'COMPLETED',
    dateAdministered: '2026-05-12',
    administeredByName: 'Sister Sunita Sharma (ANM)',
    nextDoseDue: '2026-11-12'
  }
];

export const initialNotifications = [
  {
    id: 1,
    userId: 3,
    title: 'Welcome to HealthConnect!',
    message: 'Your citizen portal is active. You can now book appointments, submit sanitation complaints, and track your health history.',
    type: 'INFO',
    isRead: false,
    createdAt: '2026-05-23T15:00:00Z'
  },
  {
    id: 2,
    userId: 3,
    title: 'Dengue Outbreak Alert',
    message: 'Health department has issued a high alert for vector-borne diseases in Rampur village. Follow preventative measures.',
    type: 'ALERT',
    isRead: false,
    createdAt: '2026-05-23T15:10:00Z'
  },
  {
    id: 3,
    userId: 2,
    title: 'New Complaint Assigned',
    message: 'A new water contamination complaint has been reported in your sector. Please inspect and update the health status.',
    type: 'ALERT',
    isRead: false,
    createdAt: '2026-05-23T15:20:00Z'
  }
];
