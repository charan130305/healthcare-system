-- HealthConnect Community System Seed Data
USE healthconnect;

-- Seed Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_CITIZEN') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_HEALTH_WORKER') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO roles (id, name) VALUES (3, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE id=id;

-- Seed Users (Passwords are BCrypt hashed for 'password')
-- Admin Account
INSERT INTO users (id, username, email, password, full_name, phone, address, role_id)
VALUES (1, 'admin', 'admin@healthconnect.org', '$2a$10$8.g28e57N.2/Z4yL0Nl2NuqU8QeL6pD7x/J9C0oXj2p3RqyZlJv9y', 'Dr. Ramesh Kumar (Director)', '+91 98765 43210', 'Health Secretariat, New Delhi', 3)
ON DUPLICATE KEY UPDATE id=id;

-- Healthcare Worker Account
INSERT INTO users (id, username, email, password, full_name, phone, address, role_id)
VALUES (2, 'worker', 'worker@healthconnect.org', '$2a$10$8.g28e57N.2/Z4yL0Nl2NuqU8QeL6pD7x/J9C0oXj2p3RqyZlJv9y', 'Sister Sunita Sharma (ANM)', '+91 87654 32109', 'Community Health Centre, Sector 4', 2)
ON DUPLICATE KEY UPDATE id=id;

-- Citizen Account
INSERT INTO users (id, username, email, password, full_name, phone, address, role_id)
VALUES (3, 'citizen', 'citizen@healthconnect.org', '$2a$10$8.g28e57N.2/Z4yL0Nl2NuqU8QeL6pD7x/J9C0oXj2p3RqyZlJv9y', 'Aarav Patel', '+91 76543 21098', 'Vill. Ram Pur, Block B', 1)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Hospitals / Clinics
INSERT INTO hospitals (id, name, address, phone, latitude, longitude, type, specialties, is_emergency_ready, rating)
VALUES 
(1, 'Apex Community Health Centre', 'Main Road, Ram Pur Village', '+91 11 2345 6789', 28.6139, 77.2090, 'Government', 'General Medicine, Pediatrics, Maternity Care', TRUE, 4.2),
(2, 'City General Hospital', 'Sector 15, Near Metro Station', '+91 11 9876 5432', 28.6250, 77.2200, 'Government', 'Emergency Trauma, Cardiology, Orthopedics, Intensive Care', TRUE, 4.5),
(3, 'Sanjivani Private Clinic', 'Bazar Marg, Block C, Ram Pur', '+91 99999 88888', 28.6080, 77.1950, 'Private', 'Dentistry, Dermatology, General Consultations', FALSE, 3.8),
(4, 'Rural Emergency Clinic', 'Highway Bypass, Junction 3', '+91 11 5555 4444', 28.5950, 77.2300, 'Government', 'First Aid, Triage, Snakebite & Poison Treatment', TRUE, 4.0)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Awareness Posts / Campaigns
INSERT INTO awareness_posts (id, author_id, title, content, category, image_url, video_url, is_published)
VALUES 
(1, 1, 'Mega Vaccination Drive for Children', 'A community-wide vaccination drive for Polio, Measles, and BCG is scheduled for next Monday (June 1st, 2026) at all Primary Health Centres. Parents are requested to bring their child\'s health card. Timing: 9:00 AM to 4:00 PM.', 'Vaccination', 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80', '', TRUE),
(2, 2, 'Preventing Dengue and Malaria This Monsoon', 'Monsoon is around the corner. Please ensure there is no stagnant water in coolers, flower pots, or open containers around your homes. Use mosquito nets and apply insect repellent regularly. If you experience high fever or body aches, report immediately.', 'Disease Alert', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80', '', TRUE),
(3, 1, 'Nutritional Guide for Expecting Mothers', 'Proper nutrition during pregnancy is crucial for both mother and child. Ensure a rich diet including green leafy vegetables, iron supplements, pulses, dairy products, and fresh fruits. Clean water intake should be at least 3 litres a day.', 'Nutrition', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80', '', TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Public Complaints
INSERT INTO complaints (id, citizen_id, title, description, category, status, priority, latitude, longitude)
VALUES 
(1, 3, 'Water Contamination in Block B Public Tap', 'The tap water supplied near Block B public school has been appearing muddy and smells bad for the past three days. Multiple children have reported stomach pain.', 'Water Contamination', 'PENDING', 'HIGH', 28.6120, 77.2050),
(2, 3, 'Overflowing Garbage Bin Near Clinic Entrance', 'The garbage bin right outside the Sanjivani Private Clinic entrance has not been cleared for a week. Strays are scattering waste everywhere, creating a heavy stench and risk of infections.', 'Sanitation', 'IN_INVESTIGATION', 'MEDIUM', 28.6085, 77.1955)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Notifications
INSERT INTO notifications (user_id, title, message, type)
VALUES 
(3, 'Welcome to HealthConnect!', 'Your citizen portal is active. You can now book appointments, submit sanitation complaints, and track your health history.', 'INFO'),
(3, 'Dengue Outbreak Alert', 'Health department has issued a high alert for vector-borne diseases in Rampur village. Follow preventative measures.', 'ALERT'),
(2, 'New Complaint Assigned', 'A new water contamination complaint has been reported in your sector. Please inspect and update the health status.', 'ALERT');

-- Seed Health & Vaccination Records
INSERT INTO health_records (citizen_id, diagnoses, prescriptions, blood_pressure, heart_rate, notes, recorded_by)
VALUES (3, 'Mild Seasonal Influenza & Dehydration', 'Tab Paracetamol 650mg TDS x 3 days, ORS fluid 1L daily, Adequate bed rest', '120/80', '76 bpm', 'Patient advised to return if fever exceeds 102F.', 2);

INSERT INTO vaccination_records (citizen_id, vaccine_name, dose_number, status, date_administered, administered_by, next_dose_due)
VALUES 
(3, 'Hepatitis B', 1, 'COMPLETED', '2026-04-10', 2, '2026-05-10'),
(3, 'Hepatitis B', 2, 'COMPLETED', '2026-05-12', 2, '2026-11-12');
