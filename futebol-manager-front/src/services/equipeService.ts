import api from './api';
import type { Equipe } from '../types/equipe';

export const listarEquipes = async (): Promise<Equipe[]> => {
    const response = await api.get<Equipe[]>('/api/equipes');
    return response.data;
};

export const criarEquipe = async (equipe: Omit<Equipe, 'id'>): Promise<Equipe> => {
    const response = await api.post<Equipe>('/api/equipes', equipe);
    return response.data;
};

export async function atualizarEquipe(id: string | number, dados: Partial<Equipe>) {
    const response = await api.put(`/api/equipes/${id}`, dados); // <--- Adicionado o /api/ em falta
    return response.data;
}

