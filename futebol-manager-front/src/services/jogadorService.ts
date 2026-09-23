import api from './api';
import type { Jogador } from '../types/jogador';

export const listarJogadores = async (): Promise<Jogador[]> => {
    const response = await api.get<Jogador[]>('/api/jogadores');
    return response.data;
};

export const criarJogador = async (jogador: Omit<Jogador, 'id'>): Promise<Jogador> => {
    const response = await api.post<Jogador>('/api/jogadores', jogador);
    return response.data;
};

export const listarJogadoresPorEquipe = async (equipeId: number): Promise<Jogador[]> => {
    const response = await api.get<Jogador[]>(`/api/jogadores/equipe/${equipeId}`);
    return response.data;
};

export const deletarJogador = async (id: number): Promise<void> => {
     await api.delete(`/api/jogadores/${id}`);
}

export const atualizarJogador = async (id: number, dados: Partial<Jogador>): Promise<Jogador> => {
    const response = await api.put<Jogador>(`/api/jogadores/${id}`, dados);
    return response.data;
};