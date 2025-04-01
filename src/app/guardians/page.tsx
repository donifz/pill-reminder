'use client';

import React from 'react';
import { GuardianManagement } from '@/components/GuardianManagement';

const Guardians = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Guardian Management</h1>
      <GuardianManagement />
    </div>
  );
};

export default Guardians; 