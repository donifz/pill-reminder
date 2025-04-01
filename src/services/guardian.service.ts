import axios from 'axios';
import { API_URL } from '@/config';

export interface Guardian {
  id: string;
  name: string;
  email: string;
  isAccepted: boolean;
}

export interface GuardianFor {
  id: string;
  name: string;
  email: string;
  isAccepted: boolean;
}

export interface GuardianResponse {
  guardians: Guardian[];
  guardianFor: GuardianFor[];
}

class GuardianService {
  async inviteGuardian(email: string): Promise<Guardian> {
    const response = await axios.post(`${API_URL}/guardians/invite`, { email });
    return response.data;
  }

  async acceptInvitation(token: string): Promise<Guardian> {
    const response = await axios.post(`${API_URL}/guardians/accept/${token}`);
    return response.data;
  }

  async getGuardians(): Promise<GuardianResponse> {
    const response = await axios.get(`${API_URL}/guardians`);
    return response.data;
  }

  async removeGuardian(guardianId: string): Promise<void> {
    await axios.delete(`${API_URL}/guardians/${guardianId}`);
  }
}

export const guardianService = new GuardianService(); 