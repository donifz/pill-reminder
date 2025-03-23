import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    withCredentials: true,
});

export interface Medication {
    id: string;
    name: string;
    dose: string;
    times: string[];
    duration: number;
    taken: boolean;
    startDate: string;
    endDate: string;
    takenDates: { date: string; times: string[] }[];
    createdAt: string;
    updatedAt: string;
}

export const medicationsApi = {
    getAll: async () => {
        const token = Cookies.get("token");

        const response = await api.get<Medication[]>("/medications", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getOne: async (id: string) => {
        const token = Cookies.get("token");
        const response = await api.get<Medication>(`/medications/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    create: async (medication: Omit<Medication, "id" | "taken" | "takenDates" | "createdAt" | "updatedAt">) => {
        const token = Cookies.get("token");

        const response = await api.post<Medication>("/medications", medication, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    toggleTaken: async (id: string, date: string, time: string) => {
        const response = await api.patch<Medication>(`/medications/${id}/toggle`, { date, time });
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/medications/${id}`);
    },
};
