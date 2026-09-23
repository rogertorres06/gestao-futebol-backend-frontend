import { useState } from 'react';
import { criarEquipe } from '../services/equipeService';
import type { Equipe } from '../types/equipe';

interface EquipeFormProps {
    onEquipeCriada: (novaEquipe: Equipe) => void;
}

export default function EquipeForm({ onEquipeCriada }: EquipeFormProps) {
    const [formData, setFormData] = useState({
        nome: '',
        estadio: '',
        divisao: '',
        orcamento: '',
        posicaoTabela: '',
        corPrimaria: '',
        escudoUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const novaEquipeData = {
                nome: formData.nome,
                estadio: formData.estadio,
                divisao: formData.divisao,
                orcamento: formData.orcamento ? Number(formData.orcamento) : 0,
                posicaoTabela: formData.posicaoTabela ? Number(formData.posicaoTabela) : undefined,
                corPrimaria: formData.corPrimaria,
                escudoUrl: formData.escudoUrl
            };

            const criada = await criarEquipe(novaEquipeData);
            onEquipeCriada(criada);
            setFormData({ nome: '', estadio: '', divisao: '', orcamento: '', posicaoTabela: '', corPrimaria: '', escudoUrl: '' });
        } catch (err) {
            console.error("Erro ao salvar equipa:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ margin: 0, color: '#f1f5f9' }}>Registrar Nova Equipa</h3>
            <input
                type="text"
                placeholder="Nome da Equipa"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                required
            />
            <input
                type="text"
                placeholder="Estádio"
                value={formData.estadio}
                onChange={e => setFormData({...formData, estadio: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
            />
            <input
                type="text"
                placeholder="Divisão (ex: Série A)"
                value={formData.divisao}
                onChange={e => setFormData({...formData, divisao: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <input
                    type="number"
                    placeholder="Orçamento"
                    value={formData.orcamento}
                    onChange={e => setFormData({...formData, orcamento: e.target.value})}
                    style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
                />
                {/* Legenda que mostra o valor formatado em tempo real */}
                {formData.orcamento && !isNaN(Number(formData.orcamento)) && (
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
            Valor real: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(formData.orcamento))}
        </span>
                )}
            </div>
            <input
                type="number"
                placeholder="Posição na Tabela (ex: 1)"
                value={formData.posicaoTabela}
                onChange={e => setFormData({...formData, posicaoTabela: e.target.value})}
                style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '0.375rem' }}
            />
            <button
                type="submit"
                style={{
                    background: '#38bdf8',
                    color: '#0f172a',
                    fontWeight: 'bold',
                    height: '42px',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                }}
            >
                Salvar Equipa
            </button>
        </form>
    );
}