'use client';

import { useState } from 'react';
import { MedicationCard } from '@/components/MedicationCard';
import { AddMedicationForm } from '@/components/AddMedicationForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import { medicationsApi, Medication } from './services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';

export default function Home() {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: medications = [], isLoading } = useQuery('medications', medicationsApi.getAll);

  const createMutation = useMutation(medicationsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('medications');
      setShowAddForm(false);
    },
  });

  const toggleMutation = useMutation(medicationsApi.toggleTaken, {
    onSuccess: () => {
      queryClient.invalidateQueries('medications');
    },
  });

  const deleteMutation = useMutation(medicationsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('medications');
    },
  });

  const handleAddMedication = (data: {
    name: string;
    dose: string;
    time: string;
    duration: number;
    startDate: string;
    endDate: string;
  }) => {
    createMutation.mutate(data);
  };

  const handleTakeMedication = (id: string) => {
    toggleMutation.mutate(id);
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

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Medication Tracker</h1>
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
          {medications.map((medication: Medication) => (
            <MedicationCard
              key={medication.id}
              id={medication.id}
              name={medication.name}
              dose={medication.dose}
              time={medication.time}
              taken={medication.taken}
              onTake={() => handleTakeMedication(medication.id)}
              onDelete={() => handleDeleteMedication(medication.id)}
            />
          ))}
          {medications.length === 0 && !showAddForm && (
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
    </main>
  );
}
