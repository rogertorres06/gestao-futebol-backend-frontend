export interface Jogador{
    id: number;
    nome: string;
    posicao: string;
    idade: number;
    overall: number;
}

export interface Equipe {
    id: number;
    nome: string;
    estadio: string;
    escudoUrl?: string;
    divisao?: string;
    posicaoTabela?: number;
    orcamento?: number; // <-- Adiciona esta linha
}