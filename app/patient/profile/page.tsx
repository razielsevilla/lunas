"use client";

import { useCallback, useEffect, useState } from 'react';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Trash2, Plus, ChevronUp, ChevronDown, Save, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import LunasLoader from '@/components/ui/loader';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [operatingOnItem, setOperatingOnItem] = useState<string | null>(null);
  
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    allergies: false,
    medications: false,
    surgeries: false,
    contacts: false,
  });

  // Set Browser Tab Title
  useEffect(() => {
    document.title = "Lunas | Patient";
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const calculateCompletion = useCallback(() => {
    if (!profile) return 0;
    const fields = [
      profile.bloodType,
      profile.isOrganDonor !== null && profile.isOrganDonor !== undefined,
      profile.heightCm,
      profile.weightKg,
      profile.allergies && profile.allergies.length > 0,
      profile.medications && profile.medications.length > 0,
      profile.surgeries && profile.surgeries.length > 0,
      profile.emergencyContacts && profile.emergencyContacts.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/patient/profile');
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
          setOriginalProfile(JSON.parse(JSON.stringify(data)));
        } else {
          showNotification('error', "Failed to load profile");
        }
      } catch (err) {
        showNotification('error', "Connection error");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const addItem = (field: string, defaultValue: object) => {
    setProfile({
      ...profile,
      [field]: [...(profile[field] || []), { ...defaultValue, tempId: crypto.randomUUID() }]
    });
  };

  const updateListItem = (field: string, index: number, key: string, value: string) => {
    const newList = [...profile[field]];
    newList[index] = { ...newList[index], [key]: value };
    setProfile({ ...profile, [field]: newList });
  };

  const handleDeleteItem = async (field: string, index: number) => {
    const item = profile[field][index];
    if (!item.id) {
      const newList = profile[field].filter((_: any, i: number) => i !== index);
      setProfile({ ...profile, [field]: newList });
      return;
    }

    const itemKey = `del-${field}-${item.id}`;
    setOperatingOnItem(itemKey);
    try {
      let endpoint = '';
      if (field === 'allergies') endpoint = `/api/patient/allergies/${item.id}`;
      else if (field === 'medications') endpoint = `/api/patient/medications/${item.id}`;
      else if (field === 'surgeries') endpoint = `/api/patient/surgeries/${item.id}`;
      else if (field === 'emergencyContacts') endpoint = `/api/patient/emergency-contacts/${item.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });

      if (res.ok) {
        const updatedList = profile[field].filter((i: any) => i.id !== item.id);
        setProfile({ ...profile, [field]: updatedList });
        showNotification('success', `Item removed successfully`);
        
        if (field === 'medications') {
          const profileRes = await fetch('/api/patient/profile');
          if (profileRes.ok) {
            const updated = await profileRes.json();
            setProfile(updated);
          }
        }
      } else {
        showNotification('error', `Failed to remove item`);
      }
    } catch (err) {
      showNotification('error', `Error removing item`);
    } finally {
      setOperatingOnItem(null);
    }
  };

  const handleSave = useCallback(async () => {
    if (!profile || !originalProfile) return;
    setIsSaving(true);
    const errors: string[] = [];

    try {
      const basicRes = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodType: profile.bloodType,
          heightCm: profile.heightCm?.toString(),
          weightKg: profile.weightKg?.toString(),
          isOrganDonor: profile.isOrganDonor,
        }),
      });

      if (!basicRes.ok) errors.push("Failed to update basic profile");

      const collections = [
        { field: 'allergies', endpoint: '/api/patient/allergies' },
        { field: 'medications', endpoint: '/api/patient/medications' },
        { field: 'surgeries', endpoint: '/api/patient/surgeries' },
        { field: 'emergencyContacts', endpoint: '/api/patient/emergency-contacts' }
      ];

      for (const col of collections) {
        for (const item of profile[col.field] || []) {
          if (!item.id) {
            const res = await fetch(col.endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
            if (!res.ok) errors.push(`Failed to add item to ${col.field}`);
          } else {
            const originalItem = originalProfile[col.field]?.find((i: any) => i.id === item.id);
            const hasChanged = JSON.stringify(item) !== JSON.stringify(originalItem);

            if (hasChanged) {
              const res = await fetch(`${col.endpoint}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
              });
              if (!res.ok) errors.push(`Failed to update item in ${col.field}`);
            }
          }
        }
      }

      if (errors.length > 0) {
        showNotification('error', errors[0]);
      } else {
        showNotification('success', "Profile updated successfully");
        const res = await fetch('/api/patient/profile');
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
          setOriginalProfile(JSON.parse(JSON.stringify(data)));
        }
      }
    } catch (err) {
      showNotification('error', "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }, [profile, originalProfile]);

  if (isLoading) {
    return (
      <PatientLayout activePath="/patient/profile">
        <div className="flex h-[60vh] w-full items-center justify-center">
          <LunasLoader />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout activePath="/patient/profile">
      <div className="mx-auto max-w-5xl px-10 py-10 pb-20">
        <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both">
          
          {notification && (
            <div className={`fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl animate-in fade-in slide-in-from-top-4 ${
              notification.type === 'success' ? 'bg-[#2D2822] text-white' : 'bg-red-600 text-white'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-[#7B8C70]" /> : <XCircle className="h-5 w-5" />}
              <span className="text-sm font-bold">{notification.text}</span>
            </div>
          )}

          {/* Header Section with widened gap */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl font-serif font-bold tracking-tight text-[#2D2822]">My Medical Profile</h1>
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C70]">Profile Completion</p>
                  <p className="text-sm font-bold text-[#2D2822]">{calculateCompletion()}%</p>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7B8C70] to-[#2D2822] transition-all duration-500"
                    style={{ width: `${calculateCompletion()}%` }}
                  />
                </div>
                <p className="mt-3 text-[11px] font-medium text-[#7B8C70]">
                  {profile.lastUpdated 
                    ? `Last updated ${new Date(profile.lastUpdated).toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })}`
                    : "Complete your profile to assist medical professionals."}
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-2xl bg-[#2D2822] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#2D2822]/90 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Medical Information */}
            <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <button onClick={() => toggleSection('basic')} className="flex w-full items-center justify-between border-b border-neutral-50 pb-6 outline-none">
                <h2 className="text-xl font-serif font-bold text-[#2D2822]">Basic Medical Information</h2>
                {collapsedSections.basic ? <ChevronDown className="h-5 w-5 text-[#7B8C70]" /> : <ChevronUp className="h-5 w-5 text-[#7B8C70]" />}
              </button>

              {!collapsedSections.basic && (
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C70]">Blood Type</label>
                    <select 
                      value={profile.bloodType || ''} 
                      onChange={(e) => setProfile({...profile, bloodType: e.target.value})}
                      className="w-full rounded-2xl border border-neutral-100 bg-[#F9F5EB]/50 px-5 py-4 text-sm font-medium text-[#2D2822] outline-none focus:ring-2 focus:ring-[#7B8C70]/10"
                    >
                      <option value="">Select type...</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C70]">Organ Donor</label>
                    <div className="flex items-center gap-6 py-4">
                      {[true, false].map((val) => (
                        <label key={val.toString()} className="flex items-center gap-2 text-sm font-semibold text-[#2D2822] cursor-pointer">
                          <input 
                            type="radio" 
                            checked={profile.isOrganDonor === val}
                            onChange={() => setProfile({...profile, isOrganDonor: val})}
                            className="h-4 w-4 accent-[#2D2822]" 
                          />
                          {val ? 'Yes' : 'No'}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C70]">Height (cm)</label>
                    <input 
                      type="number" 
                      value={profile.heightCm || ''} 
                      onChange={(e) => setProfile({...profile, heightCm: e.target.value})}
                      className="w-full rounded-2xl border border-neutral-100 bg-[#F9F5EB]/50 px-5 py-4 text-sm font-medium text-[#2D2822] outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C70]">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={profile.weightKg || ''} 
                      onChange={(e) => setProfile({...profile, weightKg: e.target.value})}
                      className="w-full rounded-2xl border border-neutral-100 bg-[#F9F5EB]/50 px-5 py-4 text-sm font-medium text-[#2D2822] outline-none" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Allergies */}
            <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <button onClick={() => toggleSection('allergies')} className="flex w-full items-center justify-between border-b border-neutral-50 pb-6 outline-none">
                <h2 className="text-xl font-serif font-bold text-[#2D2822]">Allergies</h2>
                {collapsedSections.allergies ? <ChevronDown className="h-5 w-5 text-[#7B8C70]" /> : <ChevronUp className="h-5 w-5 text-[#7B8C70]" />}
              </button>

              {!collapsedSections.allergies && (
                <div className="mt-8 space-y-4 animate-in fade-in duration-300">
                  {profile.allergies?.map((allergy: any, index: number) => {
                    const isOperating = operatingOnItem === `del-allergies-${allergy.id}`;
                    return (
                      <div key={allergy.id || allergy.tempId || index} className="space-y-4 rounded-[2rem] border border-neutral-50 bg-[#F9F5EB]/30 p-6">
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="min-w-[200px] flex-1 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Allergen</label>
                            <input 
                              type="text" 
                              value={allergy.allergen || ''} 
                              onChange={(e) => updateListItem('allergies', index, 'allergen', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="min-w-[150px] space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Severity</label>
                            <select 
                              value={allergy.severity || 'MILD'} 
                              onChange={(e) => updateListItem('allergies', index, 'severity', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm font-bold text-[#2D2822] outline-none"
                            >
                              <option value="MILD">Mild</option>
                              <option value="MODERATE">Moderate</option>
                              <option value="SEVERE">Severe</option>
                              <option value="LIFE_THREATENING">Life-Threatening</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => handleDeleteItem('allergies', index)}
                            disabled={isOperating}
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {isOperating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Reaction</label>
                          <input 
                            type="text" 
                            value={allergy.reaction || ''} 
                            onChange={(e) => updateListItem('allergies', index, 'reaction', e.target.value)}
                            className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                          />
                        </div>
                      </div>
                    );
                  })}
                  <button 
                    onClick={() => addItem('allergies', { allergen: '', reaction: '', severity: 'MILD' })}
                    className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-neutral-200 px-6 py-4 text-xs font-bold text-[#7B8C70] hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Another Allergy
                  </button>
                </div>
              )}
            </div>

            {/* Medications */}
            <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <button onClick={() => toggleSection('medications')} className="flex w-full items-center justify-between border-b border-neutral-50 pb-6 outline-none">
                <h2 className="text-xl font-serif font-bold text-[#2D2822]">Current Medications</h2>
                {collapsedSections.medications ? <ChevronDown className="h-5 w-5 text-[#7B8C70]" /> : <ChevronUp className="h-5 w-5 text-[#7B8C70]" />}
              </button>
              {!collapsedSections.medications && (
                <div className="mt-8 space-y-6 animate-in fade-in duration-300">
                  {profile.drugInteractions && profile.drugInteractions.length > 0 && (
                    <div className="rounded-[1.5rem] border-l-4 border-orange-500 bg-orange-50/50 p-6">
                      <div className="flex gap-4">
                        <AlertCircle className="h-6 w-6 flex-shrink-0 text-orange-600" />
                        <div>
                          <p className="font-bold text-orange-900">Drug Interaction Alert</p>
                          <div className="mt-3 space-y-3">
                            {profile.drugInteractions.map((interaction: any, idx: number) => (
                              <div key={idx} className={`text-sm ${
                                interaction.severity === 'HIGH' ? 'text-red-900 font-bold' : 'text-orange-900 font-medium'
                              }`}>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black mr-2 uppercase tracking-tighter ${
                                  interaction.severity === 'HIGH' 
                                    ? 'bg-red-200 text-red-900' 
                                    : 'bg-orange-200 text-orange-900'
                                }`}>
                                  {interaction.severity}
                                </span>
                                {interaction.drug1} + {interaction.drug2}
                                {interaction.description && <p className="mt-1 text-xs opacity-80">{interaction.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.medications?.map((med: any, index: number) => {
                    const isOperating = operatingOnItem === `del-medications-${med.id}`;
                    return (
                      <div key={med.id || med.tempId || index} className="space-y-4 rounded-[2rem] border border-neutral-50 bg-[#F9F5EB]/30 p-6">
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="min-w-[200px] flex-1 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Medication Name</label>
                            <input 
                              type="text" 
                              value={med.name || ''} 
                              onChange={(e) => updateListItem('medications', index, 'name', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="min-w-[150px] space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Dosage</label>
                            <input 
                              type="text" 
                              value={med.dosage || ''} 
                              onChange={(e) => updateListItem('medications', index, 'dosage', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <button 
                            onClick={() => handleDeleteItem('medications', index)}
                            disabled={isOperating}
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-300 hover:text-red-500 disabled:opacity-50"
                          >
                            {isOperating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Frequency</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Twice a day"
                              value={med.frequency || ''} 
                              onChange={(e) => updateListItem('medications', index, 'frequency', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Prescribed For</label>
                            <input 
                              type="text" 
                              placeholder="Condition"
                              value={med.prescribedFor || ''} 
                              onChange={(e) => updateListItem('medications', index, 'prescribedFor', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">rxNorm Code</label>
                            <input 
                              type="text" 
                              value={med.rxNormCode || ''} 
                              onChange={(e) => updateListItem('medications', index, 'rxNormCode', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button 
                    onClick={() => addItem('medications', { name: '', dosage: '', frequency: '', prescribedFor: '', rxNormCode: '' })}
                    className="flex items-center gap-2 rounded-2xl border border-dashed border-neutral-200 px-6 py-4 text-xs font-bold text-[#7B8C70] hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Another Medication
                  </button>
                </div>
              )}
            </div>

            {/* Surgeries */}
            <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <button onClick={() => toggleSection('surgeries')} className="flex w-full items-center justify-between border-b border-neutral-50 pb-6 outline-none">
                <h2 className="text-xl font-serif font-bold text-[#2D2822]">Previous Surgeries</h2>
                {collapsedSections.surgeries ? <ChevronDown className="h-5 w-5 text-[#7B8C70]" /> : <ChevronUp className="h-5 w-5 text-[#7B8C70]" />}
              </button>
              {!collapsedSections.surgeries && (
                <div className="mt-8 space-y-4 animate-in fade-in duration-300">
                  {profile.surgeries?.map((surgery: any, index: number) => {
                    const isOperating = operatingOnItem === `del-surgeries-${surgery.id}`;
                    return (
                      <div key={surgery.id || surgery.tempId || index} className="space-y-4 rounded-[2rem] border border-neutral-50 bg-[#F9F5EB]/30 p-6">
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="min-w-[200px] flex-1 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Procedure</label>
                            <input 
                              type="text" 
                              value={surgery.procedure || ''} 
                              onChange={(e) => updateListItem('surgeries', index, 'procedure', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="min-w-[150px] space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Date</label>
                            <input 
                              type="date" 
                              value={surgery.datePerformed ? surgery.datePerformed.split('T')[0] : ''} 
                              onChange={(e) => updateListItem('surgeries', index, 'datePerformed', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm font-bold text-[#2D2822] outline-none" 
                            />
                          </div>
                          <button 
                            onClick={() => handleDeleteItem('surgeries', index)}
                            disabled={isOperating}
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {isOperating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Hospital</label>
                          <input 
                            type="text" 
                            value={surgery.hospital || ''} 
                            onChange={(e) => updateListItem('surgeries', index, 'hospital', e.target.value)}
                            className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Notes</label>
                          <textarea 
                            value={surgery.notes || ''} 
                            onChange={(e) => updateListItem('surgeries', index, 'notes', e.target.value)}
                            className="min-h-[100px] w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <button 
                    onClick={() => addItem('surgeries', { procedure: '', datePerformed: '', hospital: '', notes: '' })}
                    className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-neutral-200 px-6 py-4 text-xs font-bold text-[#7B8C70] hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Surgery Record
                  </button>
                </div>
              )}
            </div>

            {/* Emergency Contacts */}
            <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <button onClick={() => toggleSection('contacts')} className="flex w-full items-center justify-between border-b border-neutral-50 pb-6 outline-none">
                <h2 className="text-xl font-serif font-bold text-[#2D2822]">Emergency Contacts</h2>
                {collapsedSections.contacts ? <ChevronDown className="h-5 w-5 text-[#7B8C70]" /> : <ChevronUp className="h-5 w-5 text-[#7B8C70]" />}
              </button>
              {!collapsedSections.contacts && (
                <div className="mt-8 space-y-4 animate-in fade-in duration-300">
                  {profile.emergencyContacts?.map((contact: any, index: number) => {
                    const isOperating = operatingOnItem === `del-emergencyContacts-${contact.id}`;
                    return (
                      <div key={contact.id || contact.tempId || index} className="space-y-4 rounded-[2rem] border border-neutral-50 bg-[#F9F5EB]/30 p-6">
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="min-w-[200px] flex-1 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Full Name</label>
                            <input 
                              type="text" 
                              value={contact.name || ''} 
                              onChange={(e) => updateListItem('emergencyContacts', index, 'name', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="min-w-[150px] space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Relationship</label>
                            <input 
                              type="text" 
                              value={contact.relationship || ''} 
                              onChange={(e) => updateListItem('emergencyContacts', index, 'relationship', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <button 
                            onClick={() => handleDeleteItem('emergencyContacts', index)}
                            disabled={isOperating}
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {isOperating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="min-w-[200px] flex-1 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Mobile Number</label>
                            <input 
                              type="tel" 
                              placeholder="+63 9XX XXX XXXX"
                              value={contact.mobile || ''} 
                              onChange={(e) => updateListItem('emergencyContacts', index, 'mobile', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                          <div className="min-w-[200px] flex-1 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#7B8C70]">Email (optional)</label>
                            <input 
                              type="email" 
                              value={contact.email || ''} 
                              onChange={(e) => updateListItem('emergencyContacts', index, 'email', e.target.value)}
                              className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm text-[#2D2822] font-medium outline-none" 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button 
                    onClick={() => addItem('emergencyContacts', { name: '', relationship: '', mobile: '', email: '' })}
                    className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-neutral-200 px-6 py-4 text-xs font-bold text-[#7B8C70] hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Emergency Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}