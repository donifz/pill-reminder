'use client';

import React, { useState, useEffect } from 'react';
import { MedicationCard } from '@/components/MedicationCard';
import { AddMedicationForm } from '@/components/AddMedicationForm';
import { medicationService } from '@/services/medication.service';
import { Button, Tabs, message } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Medication {
  id: string;
  name: string;
  dose: string;
  times: string[];
  taken: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
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

const Medications = () => {
  const [medications, setMedications] = useState<MedicationsResponse>({
    userMedications: [],
    guardianMedications: [],
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const data = await medicationService.getAll();
      setMedications(data);
    } catch (error) {
      message.error('Failed to load medications');
    }
  };

  const handleTake = async (id: string, date: string, time: string) => {
    try {
      await medicationService.toggleTaken(id, date, time);
      loadMedications();
    } catch (error) {
      message.error('Failed to update medication status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await medicationService.delete(id);
      message.success('Medication deleted successfully');
      loadMedications();
    } catch (error) {
      message.error('Failed to delete medication');
    }
  };

  const items = [
    {
      key: 'my-medications',
      label: 'My Medications',
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Medications</h2>
            <Button
              type="primary"
              icon={<PlusIcon className="h-5 w-5" />}
              onClick={() => setShowAddForm(true)}
            >
              Add Medication
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {medications.userMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                {...medication}
                onTake={() => handleTake(medication.id, new Date().toISOString().split('T')[0], new Date().toLocaleTimeString('en-US', { hour12: false }))}
                onDelete={() => handleDelete(medication.id)}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'guardian-medications',
      label: 'Guardian Medications',
      children: (
        <div className="space-y-6">
          {medications.guardianMedications.map(({ user, medications: userMedications }) => (
            <div key={user.id} className="space-y-4">
              <h2 className="text-xl font-semibold">{user.name}'s Medications</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userMedications.map((medication) => (
                  <MedicationCard
                    key={medication.id}
                    {...medication}
                    user={user}
                    isGuardian
                    onTake={() => handleTake(medication.id, new Date().toISOString().split('T')[0], new Date().toLocaleTimeString('en-US', { hour12: false }))}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs items={items} />
      {showAddForm && (
        <AddMedicationForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadMedications();
          }}
        />
      )}
    </div>
  );
};

export default Medications;