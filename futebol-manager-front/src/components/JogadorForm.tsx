import { useState, useEffect } from 'react';
import { criarJogador } from '../services/jogadorService';
import { listarEquipes } from '../services/equipeService';
import type { Equipe } from '../types/equipe';

interface JogadorFormProps {
    onJogadorCriado: () => void;
}

export default function JogadorForm({ onJogadorCriado }: JogadorFormProps) {
    const [equipes, setEquipes] = useState<Equipe[]>([]);
    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        posicao: '',
        overall: '',
        equipeId: '',
        nomeEquipe: ''
    });

    useEffect(() => {
        listarEquipes()
            .then(setEquipes)
            .catch(err => console.error("Erro ao carregar equipas para o formulário:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await criarJogador({
                nome: formData.nome,
                idade: Number(formData.idade),
                posicao: formData.posicao,
                overall: Number(formData.overall),
                nomeEquipe: formData.nomeEquipe
            });
            onJogadorCriado();
            setFormData({ nome: '', idade: '', posicao: '', overall: '', equipeId: '', nomeEquipe: '' });
        } catch (err) {
            console.error("Erro ao contratar jogador:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ margin: 0, color: '#f1f5f9' }}>Contratar Novo Jogador</h3>
            <input
                type="text"
                placeholder="Nome do Jogador"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                required
            />
            <input
                type="number"
                placeholder="Idade"
                value={formData.idade}
                onChange={e => setFormData({...formData, idade: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                required
            />
            <input
                type="text"
                placeholder="Posição (ex: PL, MC, GR)"
                value={formData.posicao}
                onChange={e => setFormData({...formData, posicao: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                required
            />
            <input
                type="number"
                placeholder="Overall (ex: 85)"
                value={formData.overall}
                onChange={e => setFormData({...formData, overall: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                required
            />
            <select
                value={formData.nomeEquipe}
                onChange={e => setFormData({...formData, nomeEquipe: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                required
            >
                <option value="">Selecione a Equipa de Destino</option>
                {equipes.map(eq => (
                    <option key={eq.id} value={eq.nome}>{eq.nome}</option>
                ))}
            </select>
            <button
                type="submit"
                style={{
                    background: '#38bdf8',
                    color: '#0f172a',
                    fontWeight: 'bold',
                    height: '42px', // Altura fixa igualada ao outro botão
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                }}
            >
                Efetivar Contratação
            </button>
        </form>
    );
}