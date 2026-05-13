"use client";

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';

type ProfileData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  prcNumber: string;
  profession: string;
  specialization: string;
  hospitalAffiliation: string;
  prcStatus: string;
  pinSet: boolean;
};

export default function ProfessionalProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/professional/profile');
        if (!response.ok) {
          throw new Error('Failed to load profile data');
        }
        const profileData = await response.json();
        setData(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <p className="mt-1 text-gray-900">{data.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <p className="mt-1 text-gray-900">{data.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{data.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <p className="mt-1 text-gray-900">{data.mobile || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PRC Number</label>
            <p className="mt-1 text-gray-900">{data.prcNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profession</label>
            <p className="mt-1 text-gray-900">{data.profession}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <p className="mt-1 text-gray-900">{data.specialization}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital Affiliation</label>
            <p className="mt-1 text-gray-900">{data.hospitalAffiliation}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PRC Status</label>
            <p className="mt-1 text-gray-900">{data.prcStatus}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PIN Set</label>
            <p className="mt-1 text-gray-900">{data.pinSet ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}