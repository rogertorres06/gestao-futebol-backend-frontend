import { useState, useEffect } from 'react';
import { listarEquipes, atualizarEquipe } from '../services/equipeService';
import { listarJogadoresPorEquipe, deletarJogador, atualizarJogador } from '../services/jogadorService';
import type { Equipe } from '../types/equipe';
import type { Jogador } from '../types/jogador';

const obterEscudoUrl = (nome: string, escudoUrlCustom?: string) => {
    if (escudoUrlCustom && escudoUrlCustom.trim() !== '') {
        return escudoUrlCustom;
    }

    const n = nome.toLowerCase();
    if (n.includes('fluminense')) return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3442.png&h=200&w=200';
    if (n.includes('botafogo')) return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3440.png&h=200&w=200';
    if (n.includes('vasco')) return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3456.png&h=200&w=200';
    if (n.includes('são paulo') || n.includes('sao paulo')) return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2039.png&h=200&w=200';
    if (n.includes('coritiba')) return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2959.png&h=200&w=200';

    return 'https://cdn-icons-png.flaticon.com/512/52/52011.png';
};

export default function EquipeList() {
    const [equipes, setEquipes] = useState<Equipe[]>([]);
    const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null);
    const [jogadoresDaEquipa, setJogadoresDaEquipa] = useState<Jogador[]>([]);

    const [jogadorEditando, setJogadorEditando] = useState<Jogador | null>(null);
    const [nomeEdicao, setNomeEdicao] = useState('');
    const [posicaoEdicao, setPosicaoEdicao] = useState('');
    const [overallEdicao, setOverallEdicao] = useState(0);
    const [idadeEdicao, setIdadeEdicao] = useState(0);

    const [equipeEditando, setEquipeEditando] = useState<Equipe | null>(null);
    const [nomeEquipeEdicao, setNomeEquipeEdicao] = useState('');
    const [estadioEdicao, setEstadioEdicao] = useState('');
    const [escudoUrlEdicao, setEscudoUrlEdicao] = useState('');

    const [divisaoEdicao, setDivisaoEdicao] = useState('');
    const [posicaoTabelaEdicao, setPosicaoTabelaEdicao] = useState<number | ''>('');
    const [orcamentoEdicao, setOrcamentoEdicao] = useState<number | ''>(''); // <-- Adicionado estado para o orçamento

    useEffect(() => {
        listarEquipes()
            .then(setEquipes)
            .catch(err => console.error("Erro ao carregar equipas:", err));
    }, []);

    const handleSelecionarEquipe = async (equipe: Equipe) => {
        setEquipeSelecionada(equipe.nome);
        try {
            const plantel = await listarJogadoresPorEquipe(equipe.id);
            setJogadoresDaEquipa(plantel);
        } catch (err) {
            console.error("Erro ao buscar jogadores da equipa:", err);
        }
    };

    const iniciarEdicao = (jogador: Jogador) => {
        setJogadorEditando(jogador);
        setNomeEdicao(jogador.nome);
        setPosicaoEdicao(jogador.posicao);
        setOverallEdicao(jogador.overall);
        setIdadeEdicao(jogador.idade);
    };

    const salvarEdicao = async () => {
        if (!jogadorEditando || !jogadorEditando.id) return;
        try {
            const jogadorAtualizado = await atualizarJogador(jogadorEditando.id, {
                nome: nomeEdicao,
                posicao: posicaoEdicao,
                overall: overallEdicao,
                idade: idadeEdicao,
                nomeEquipe: equipeSelecionada ?? undefined,
            });

            setJogadoresDaEquipa(jogadoresDaEquipa.map(j => j.id === jogadorAtualizado.id ? jogadorAtualizado : j));
            setJogadorEditando(null);
        } catch (err) {
            console.error("Erro ao atualizar jogador:", err);
        }
    };

    const salvarEdicaoEquipe = async () => {
        if (!equipeEditando || !equipeEditando.id) return;
        try {
            const equipeAtualizada = await atualizarEquipe(equipeEditando.id, {
                nome: nomeEquipeEdicao,
                estadio: estadioEdicao,
                escudoUrl: escudoUrlEdicao,
                divisao: divisaoEdicao,
                posicaoTabela: posicaoTabelaEdicao === '' ? null : Number(posicaoTabelaEdicao),
                orcamento: orcamentoEdicao === '' ? 0 : Number(orcamentoEdicao), // <-- Enviando orçamento atualizado
            } as any);

            setEquipes(equipes.map(eq => eq.id === equipeAtualizada.id ? equipeAtualizada : eq));

            if (equipeSelecionada === equipeEditando.nome) {
                setEquipeSelecionada(equipeAtualizada.nome);
            }

            setEquipeEditando(null);
        } catch (err) {
            console.error("Erro ao atualizar equipa:", err);
        }
    };

    return (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', color: '#f1f5f9', border: '1px solid #334155' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Equipas Registradas (Clica numa equipa)</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem', alignItems: 'stretch' }}>
                {equipes.map(eq => {
                    return (
                        <div
                            key={eq.id}
                            onClick={() => handleSelecionarEquipe(eq)}
                            style={{
                                background: '#0f172a',
                                border: equipeSelecionada === eq.nome ? '2px solid #38bdf8' : '1px solid #334155',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#1e293b',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '1px solid #334155'
                                    }}>
                                        <img
                                            src={obterEscudoUrl(eq.nome, eq.escudoUrl)}
                                            alt={`Escudo de ${eq.nome}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e)=>{
                                                (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/52/52011.png';
                                            }}
                                        />
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', lineHeight: '1.25', wordBreak: 'break-word' }}>{eq.nome}</h4>
                                </div>

                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.813rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <span>🏟️</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.estadio}</span>
                                </p>

                                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.813rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <span>🏆</span> <span>{eq.divisao || 'Série A'} — {eq.posicaoTabela ? `${eq.posicaoTabela}º lugar` : 'Posição não definida'}</span>
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEquipeEditando(eq);
                                    setNomeEquipeEdicao(eq.nome);
                                    setEstadioEdicao(eq.estadio);
                                    setEscudoUrlEdicao(eq.escudoUrl || '');
                                    setDivisaoEdicao(eq.divisao || '');
                                    setPosicaoTabelaEdicao(eq.posicaoTabela ?? '');
                                    setOrcamentoEdicao((eq as any).orcamento ?? ''); // <-- Preenche o orçamento ao abrir
                                }}
                                style={{
                                    width: '100%',
                                    background: '#38bdf8',
                                    color: '#0f172a',
                                    border: 'none',
                                    padding: '0.50rem',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontSize: '0.813rem',
                                    fontWeight: '700',
                                    textAlign: 'center'
                                }}
                            >
                                Editar Equipa
                            </button>
                        </div>
                    );
                })}
            </div>

            {equipeSelecionada && (
                <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ marginTop: 0, color: '#38bdf8' }}>Plantel de {equipeSelecionada}</h4>
                    {jogadoresDaEquipa.length === 0 ? (
                        <p style={{ color: '#94a3b8', margin: 0 }}>Nenhum jogador contratado para esta equipa ainda.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {jogadoresDaEquipa.map((jogador: Jogador) => (
                                <div key={jogador.id} style={{
                                    background: '#1e293b',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #334155',
                                    color: '#f8fafc',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <strong>{jogador.nome}</strong> — {jogador.posicao} <span style={{ color: '#94a3b8' }}>(Overall: {jogador.overall}, {jogador.idade} anos)</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => iniciarEdicao(jogador)}
                                            style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!jogador.id) return;
                                                if (confirm(`Tens a certeza que pretendes dispensar ${jogador.nome}?`)) {
                                                    try {
                                                        await deletarJogador(jogador.id);
                                                        setJogadoresDaEquipa(jogadoresDaEquipa.filter(j => j.id !== jogador.id));
                                                    } catch (err) {
                                                        console.error("Erro ao eliminar jogador:", err);
                                                    }
                                                }
                                            }}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                                        >
                                            Dispensar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Edição da Equipa */}
            {equipeEditando && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #334155', width: '400px', color: '#f1f5f9', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginTop: 0, color: '#38bdf8' }}>Editar Equipa & Classificação</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Nome da Equipa:</label>
                                <input
                                    type="text"
                                    value={nomeEquipeEdicao}
                                    onChange={e => setNomeEquipeEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estádio:</label>
                                <input
                                    type="text"
                                    value={estadioEdicao}
                                    onChange={e => setEstadioEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Divisão:</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Série A"
                                    value={divisaoEdicao}
                                    onChange={e => setDivisaoEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Posição na Tabela:</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 4"
                                    value={posicaoTabelaEdicao}
                                    onChange={e => setPosicaoTabelaEdicao(e.target.value === '' ? '' : Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>

                            {/* Campo de Orçamento com Legenda Formatada */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Orçamento:</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 50000000"
                                    value={orcamentoEdicao}
                                    onChange={e => setOrcamentoEdicao(e.target.value === '' ? '' : Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                                {orcamentoEdicao !== '' && !isNaN(Number(orcamentoEdicao)) && (
                                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem', display: 'block' }}>
                                        Valor real: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(orcamentoEdicao))}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>URL do Escudo (Opcional):</label>
                                <input
                                    type="text"
                                    placeholder="Ex: https://site.com/escudo.png"
                                    value={escudoUrlEdicao}
                                    onChange={e => setEscudoUrlEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setEquipeEditando(null)}
                                    style={{ background: '#475569', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={salvarEdicaoEquipe}
                                    style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '700' }}
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Edição do Jogador */}
            {jogadorEditando && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #334155', width: '400px', color: '#f1f5f9' }}>
                        <h3 style={{ marginTop: 0, color: '#38bdf8' }}>Editar Atleta</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Nome:</label>
                                <input
                                    type="text"
                                    value={nomeEdicao}
                                    onChange={e => setNomeEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Posição:</label>
                                <input
                                    type="text"
                                    value={posicaoEdicao}
                                    onChange={e => setPosicaoEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Overall:</label>
                                    <input
                                        type="number"
                                        value={overallEdicao}
                                        onChange={e => setOverallEdicao(Number(e.target.value))}
                                        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Idade:</label>
                                    <input
                                        type="number"
                                        value={idadeEdicao}
                                        onChange={e => setIdadeEdicao(Number(e.target.value))}
                                        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setJogadorEditando(null)}
                                    style={{ background: '#475569', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={salvarEdicao}
                                    style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '700' }}
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}