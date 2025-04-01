'use client';

import { useState } from 'react';
import { MedicationCard } from '@/components/MedicationCard';
import { AddMedicationForm } from '@/components/AddMedicationForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import { medicationsApi, Medication } from './services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Tabs } from 'antd';

interface ToggleParams {
  id: string;
  date: string;
  time: string;
}

interface MedicationsResponse {
  userMedications: Medication[];
  guardianMedications: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    medications: Medication[];
  }[];
}

export default function Home() {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: medicationsData = { userMedications: [], guardianMedications: [] }, isLoading } = useQuery<MedicationsResponse>('medications', medicationsApi.getAll);

  const createMutation = useMutation(medicationsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('medications');
      setShowAddForm(false);
    },
  });

  const toggleMutation = useMutation(
    (params: ToggleParams) => medicationsApi.toggleTaken(params.id, params.date, params.time),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('medications');
      },
    }
  );

  const deleteMutation = useMutation(medicationsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('medications');
    },
  });

  const handleAddMedication = (data: {
    name: string;
    dose: string;
    times: string[];
    duration: number;
    startDate: string;
    endDate: string;
  }) => {
    createMutation.mutate(data);
  };

  const handleTakeMedication = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const medication = [...medicationsData.userMedications, ...medicationsData.guardianMedications.flatMap(g => g.medications)].find(m => m.id === id);
    if (!medication) return;

    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const nextTime = medication.times.find(time => time >= currentTime) || medication.times[0];
    
    toggleMutation.mutate({ id, date: today, time: nextTime });
  };

  const handleDeleteMedication = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const items = [
    {
      key: 'my-medications',
      label: 'My Medications',
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Medications</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Medication
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6">
              <AddMedicationForm onSubmit={handleAddMedication} />
            </div>
          )}

          <div className="space-y-4">
            {medicationsData.userMedications.map((medication: Medication) => (
              <MedicationCard
                key={medication.id}
                id={medication.id}
                name={medication.name}
                dose={medication.dose}
                times={medication.times}
                taken={medication.taken}
                onTake={() => handleTakeMedication(medication.id)}
                onDelete={() => handleDeleteMedication(medication.id)}
              />
            ))}
            {medicationsData.userMedications.length === 0 && !showAddForm && (
              <div className="text-center py-12">
                <p className="text-gray-500">No medications added yet.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Add your first medication
                </button>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'guardian-medications',
      label: 'Guardian Medications',
      children: (
        <div className="space-y-6">
          {medicationsData.guardianMedications.map(({ user, medications }) => (
            <div key={user.id} className="space-y-4">
              <h2 className="text-xl font-semibold">{user.name}&apos;s Medications</h2>
              <div className="space-y-4">
                {medications.map((medication: Medication) => (
                  <MedicationCard
                    key={medication.id}
                    id={medication.id}
                    name={medication.name}
                    dose={medication.dose}
                    times={medication.times}
                    taken={medication.taken}
                    user={user}
                    isGuardian
                    onTake={() => handleTakeMedication(medication.id)}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
          {medicationsData.guardianMedications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No guardian medications to display.</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Medications</h1>
        <Tabs items={items} />
      </div>
    </main>
  );
}
