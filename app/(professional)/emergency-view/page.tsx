"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type PatientData = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  bloodType: string;
  organDonor: boolean;
  allergies: Array<{
    allergen: string;
    reaction: string;
    severity: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  drugInteractions: Array<{
    drug1: string;
    drug2: string;
    severity: string;
    description: string;
  }>;
  surgeries: Array<{
    procedure: string;
    datePerformed: string;
    hospital: string;
    notes: string;
  }>;
};

export default function EmergencyView() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    // Read patient data from sessionStorage (set by PIN entry page)
    const data = sessionStorage.getItem('emergencyPatientData');
    if (data) {
      try {
        setPatientData(JSON.parse(data));
      } catch (error) {
        console.error('Failed to parse patient data:', error);
        router.push('/professional/dashboard');
      }
    } else {
      // No data, redirect back
      router.push('/professional/dashboard');
    }
  }, [router]);

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading emergency data...</div>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patientData.birthDate);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">
          {patientData.firstName} {patientData.lastName}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
          <div>
            <span className="font-semibold">Age:</span> {age} years old
          </div>
          <div>
            <span className="font-semibold">Blood Type:</span> {patientData.bloodType}
          </div>
          <div>
            <span className="font-semibold">Organ Donor:</span> {patientData.organDonor ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Allergies</h2>
        {patientData.allergies.length === 0 ? (
          <p className="text-gray-400">No known allergies</p>
        ) : (
          <ul className="space-y-2">
            {patientData.allergies.map((allergy, index) => (
              <li key={index} className={`p-3 rounded ${allergy.severity === 'LIFE_THREATENING' ? 'bg-red-900 border-l-4 border-red-500' : 'bg-gray-700'}`}>
                <div className={`font-semibold ${allergy.severity === 'LIFE_THREATENING' ? 'text-red-300' : 'text-white'}`}>
                  {allergy.allergen}
                </div>
                <div className="text-gray-300">{allergy.reaction}</div>
                <div className="text-sm text-gray-400">Severity: {allergy.severity}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Medications */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Medications</h2>
        {patientData.medications.length === 0 ? (
          <p className="text-gray-400">No current medications</p>
        ) : (
          <ul className="space-y-2">
            {patientData.medications.map((med, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded">
                <div className="font-semibold">{med.name}</div>
                <div className="text-gray-300">{med.dosage} — {med.frequency}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Drug Interactions */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Drug Interactions</h2>
        {patientData.drugInteractions.length === 0 ? (
          <p className="text-gray-400">No known drug interactions</p>
        ) : (
          <ul className="space-y-2">
            {patientData.drugInteractions.map((interaction, index) => (
              <li key={index} className={`p-3 rounded border-l-4 ${
                interaction.severity === 'HIGH' ? 'bg-red-900 border-red-500' :
                interaction.severity === 'MODERATE' ? 'bg-yellow-900 border-yellow-500' :
                'bg-gray-700 border-gray-500'
              }`}>
                <div className="font-semibold">
                  {interaction.drug1} + {interaction.drug2}
                </div>
                <div className="text-gray-300">{interaction.description}</div>
                <div className={`text-sm font-bold ${
                  interaction.severity === 'HIGH' ? 'text-red-300' :
                  interaction.severity === 'MODERATE' ? 'text-yellow-300' :
                  'text-gray-300'
                }`}>
                  Severity: {interaction.severity}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Surgeries/History */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Surgical History</h2>
        {patientData.surgeries.length === 0 ? (
          <p className="text-gray-400">No surgical history</p>
        ) : (
          <ul className="space-y-2">
            {patientData.surgeries.map((surgery, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded">
                <div className="font-semibold">{surgery.procedure}</div>
                <div className="text-gray-300">
                  {new Date(surgery.datePerformed).toLocaleDateString()} — {surgery.hospital}
                </div>
                {surgery.notes && <div className="text-gray-400 text-sm">{surgery.notes}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="bg-red-900 text-center py-4 rounded-lg">
        <p className="text-xl font-bold text-white">
          EMERGENCY VIEW — ACCESS LOGGED — CONTACTS NOTIFIED
        </p>
      </div>
    </div>
  );
}