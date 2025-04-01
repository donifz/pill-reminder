import axios from 'axios';
import { API_URL } from '@/config';

export interface Medication {
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

export interface MedicationsResponse {
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

export interface CreateMedicationDto {
  name: string;
  dose: string;
  times: string[];
  duration: number;
  startDate: string;
  endDate: string;
}

class MedicationService {
  async getAll(): Promise<MedicationsResponse> {
    const response = await axios.get(`${API_URL}/medications`);
    return response.data;
  }

  async create(dto: CreateMedicationDto): Promise<Medication> {
    const response = await axios.post(`${API_URL}/medications`, dto);
    return response.data;
  }

  async toggleTaken(id: string, date: string, time: string): Promise<Medication> {
    const response = await axios.patch(`${API_URL}/medications/${id}/toggle`, {
      date,
      time,
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/medications/${id}`);
  }
}

export const medicationService = new MedicationService(); 