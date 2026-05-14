import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertAdmin() {
  const passwordHash = await bcrypt.hash('Admin#1234', 12);

  await prisma.user.upsert({
    where: { email: 'admin@lunas.app' },
    update: {
      firstName: 'System',
      lastName: 'Admin',
      mobile: '+639170000001',
      role: 'ADMIN',
      passwordHash,
    },
    create: {
      email: 'admin@lunas.app',
      firstName: 'System',
      lastName: 'Admin',
      mobile: '+639170000001',
      role: 'ADMIN',
      passwordHash,
    },
  });
}

async function upsertPatient(data: {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  bloodType: string;
  heightCm: string;
  weightKg: string;
  organDonor: boolean;
  allergy: { allergen: string; reaction: string; severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING' };
  medication: { name: string; dosage: string; frequency: string; prescribedFor: string };
  surgery: { procedure: string; datePerformed: string; hospital: string; notes: string };
  emergencyContact: { name: string; relationship: string; mobile: string; email: string };
}) {
  const passwordHash = await bcrypt.hash('Patient#1234', 12);

  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      role: 'PATIENT',
      passwordHash,
    },
    create: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      role: 'PATIENT',
      passwordHash,
    },
  });

  const patientProfile = await prisma.patientProfile.upsert({
    where: { userId: user.id },
    update: {
      bloodType: data.bloodType,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      isOrganDonor: data.organDonor,
      profileComplete: 90,
      lastUpdated: new Date(),
    },
    create: {
      userId: user.id,
      bloodType: data.bloodType,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      isOrganDonor: data.organDonor,
      profileComplete: 90,
    },
  });

  await prisma.allergy.deleteMany({ where: { patientProfileId: patientProfile.id } });
  await prisma.medication.deleteMany({ where: { patientProfileId: patientProfile.id } });
  await prisma.surgery.deleteMany({ where: { patientProfileId: patientProfile.id } });
  await prisma.emergencyContact.deleteMany({ where: { patientProfileId: patientProfile.id } });

  await prisma.allergy.create({
    data: {
      patientProfileId: patientProfile.id,
      allergen: data.allergy.allergen,
      reaction: data.allergy.reaction,
      severity: data.allergy.severity,
    },
  });

  await prisma.medication.create({
    data: {
      patientProfileId: patientProfile.id,
      name: data.medication.name,
      dosage: data.medication.dosage,
      frequency: data.medication.frequency,
      prescribedFor: data.medication.prescribedFor,
    },
  });

  await prisma.surgery.create({
    data: {
      patientProfileId: patientProfile.id,
      procedure: data.surgery.procedure,
      datePerformed: data.surgery.datePerformed,
      hospital: data.surgery.hospital,
      notes: data.surgery.notes,
    },
  });

  await prisma.emergencyContact.create({
    data: {
      patientProfileId: patientProfile.id,
      name: data.emergencyContact.name,
      relationship: data.emergencyContact.relationship,
      mobile: data.emergencyContact.mobile,
      email: data.emergencyContact.email,
    },
  });
}

async function upsertProfessional(data: {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  prcNumber: string;
  profession: string;
  specialization: string;
  hospitalAffil: string;
}) {
  const passwordHash = await bcrypt.hash('Doctor#1234', 12);
  const pinHash = await bcrypt.hash('123456', 12);

  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      role: 'PROFESSIONAL',
      passwordHash,
    },
    create: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      role: 'PROFESSIONAL',
      passwordHash,
    },
  });

  await prisma.professionalProfile.upsert({
    where: { userId: user.id },
    update: {
      prcNumber: data.prcNumber,
      profession: data.profession,
      specialization: data.specialization,
      hospitalAffil: data.hospitalAffil,
      prcStatus: 'VERIFIED',
      pin: pinHash,
      pinFailCount: 0,
      verifiedAt: new Date(),
      lastPrcCheck: new Date(),
    },
    create: {
      userId: user.id,
      prcNumber: data.prcNumber,
      profession: data.profession,
      specialization: data.specialization,
      hospitalAffil: data.hospitalAffil,
      prcStatus: 'VERIFIED',
      pin: pinHash,
      pinFailCount: 0,
      verifiedAt: new Date(),
      lastPrcCheck: new Date(),
    },
  });
}

async function main() {
  await upsertAdmin();

  await upsertPatient({
    email: 'maria.santos@lunas.app',
    firstName: 'Maria',
    lastName: 'Santos',
    mobile: '+639171234567',
    bloodType: 'O+',
    heightCm: '162',
    weightKg: '54',
    organDonor: true,
    allergy: {
      allergen: 'Penicillin',
      reaction: 'Anaphylaxis',
      severity: 'LIFE_THREATENING',
    },
    medication: {
      name: 'Salbutamol 100mcg',
      dosage: '1 puff',
      frequency: 'As needed',
      prescribedFor: 'Asthma',
    },
    surgery: {
      procedure: 'Appendectomy',
      datePerformed: '2023-03',
      hospital: 'PGH',
      notes: 'No complications',
    },
    emergencyContact: {
      name: 'Jose Santos',
      relationship: 'Spouse',
      mobile: '+639171112222',
      email: 'jose.santos@lunas.app',
    },
  });

  await upsertPatient({
    email: 'juan.delacruz@lunas.app',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    mobile: '+639189876543',
    bloodType: 'A+',
    heightCm: '170',
    weightKg: '68',
    organDonor: false,
    allergy: {
      allergen: 'Shellfish',
      reaction: 'Facial swelling',
      severity: 'SEVERE',
    },
    medication: {
      name: 'Losartan 50mg',
      dosage: '50mg',
      frequency: 'Once daily',
      prescribedFor: 'Hypertension',
    },
    surgery: {
      procedure: 'Knee arthroscopy',
      datePerformed: '2022-09',
      hospital: 'St. Luke\'s Medical Center',
      notes: 'Recovered well',
    },
    emergencyContact: {
      name: 'Ana Dela Cruz',
      relationship: 'Sister',
      mobile: '+639171113333',
      email: 'ana.delacruz@lunas.app',
    },
  });

  await upsertProfessional({
    email: 'dr.ramon.cruz@lunas.app',
    firstName: 'Ramon',
    lastName: 'Cruz',
    mobile: '+639179876543',
    prcNumber: 'PRC-0097451',
    profession: 'Physician',
    specialization: 'Emergency Medicine',
    hospitalAffil: 'St. Luke\'s Medical Center',
  });

  await upsertProfessional({
    email: 'dr.andrea.lim@lunas.app',
    firstName: 'Andrea',
    lastName: 'Lim',
    mobile: '+639188887777',
    prcNumber: 'PRC-0042119',
    profession: 'Physician',
    specialization: 'Cardiology',
    hospitalAffil: 'The Medical City',
  });

  console.log('Seed complete: 1 admin, 2 patients, 2 verified professionals.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
