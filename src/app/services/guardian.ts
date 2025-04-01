import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Guardian {
    id: string;
    isAccepted: boolean;
    invitationToken: string;
    invitationExpiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    guardian: {
        id: string;
        name: string;
        email: string;
        password?: string;
        createdAt?: string;
        updatedAt?: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface GuardianResponse {
    id: string;
    isAccepted: boolean;
    invitationToken: string;
    invitationExpiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    guardian: {
        id: string;
        name: string;
        email: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    taken: Record<string, string[]>;
    createdAt: Date;
    updatedAt: Date;
}

interface AcceptInvitationParams {
    token: string;
}

const guardianApi = {
    inviteGuardian: async (email: string): Promise<Guardian> => {
        const token = Cookies.get('token');
        const response = await axios.post(
            `${API_URL}/guardians/invite`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },

    acceptInvitation: async ({ token }: AcceptInvitationParams): Promise<Guardian> => {
        const authToken = Cookies.get('token');
        console.log('Accepting invitation with token:', token);
        console.log('Auth token:', authToken);
        try {
            const response = await axios.post(
                `${API_URL}/guardians/accept/${token}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            console.log('Accept invitation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Accept invitation error:', error);
            throw error;
        }
    },

    getGuardians: async (): Promise<Guardian[]> => {
        const token = Cookies.get('token');
        const response = await axios.get(`${API_URL}/guardians`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data,"response.data================================");
        
        return response.data;
    },

    getGuardianFor: async (): Promise<Guardian[]> => {
        const token = Cookies.get('token');
        const response = await axios.get(`${API_URL}/guardians/for`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    removeGuardian: async (guardianId: string): Promise<void> => {
        const token = Cookies.get('token');
        await axios.delete(`${API_URL}/guardians/${guardianId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export { guardianApi }; 