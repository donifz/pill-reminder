'use client';

import React from 'react';
import { GuardianManagement } from '../components/GuardianManagement';

export default function Guardians() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Guardian Management</h1>
        <GuardianManagement />
      </div>
    </div>
  );
} 