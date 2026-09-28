export interface Jogador {
    id?: string;
    nome: string;
    idade: number;
    posicao: string;
    overall: number;
    salario?: number; // <-- Adicione esta linha
    numeroCamisa?: number;
    titular?: boolean;
    equipeId?: string;
    nomeEquipe?: string;
}