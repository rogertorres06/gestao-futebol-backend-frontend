import { useState, useEffect } from 'react';
import { listarEquipes, atualizarEquipe } from '../services/equipeService';
import { listarJogadoresPorEquipe, deletarJogador, atualizarJogador } from '../services/jogadorService';
import type { Equipe } from '../types/equipe';
import type { Jogador } from '../types/jogador';

const obterEscudoUrl = (nome: string, escudoUrlCustom?: string) => {
    if (escudoUrlCustom && escudoUrlCustom.trim() !== '') {
        return escudoUrlCustom;
    }

    const n = nome.toLowerCase().trim();

    if (n.includes('vasco')) {
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3456.png&h=200&w=200';
    }
    if (n.includes('fluminense')) {
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3442.png&h=200&w=200';
    }
    if (n.includes('botafogo')) {
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3440.png&h=200&w=200';
    }
    if (n.includes('são paulo') || n.includes('sao paulo')) {
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2039.png&h=200&w=200';
    }
    if (n.includes('coritiba')) {
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2959.png&h=200&w=200';
    }

    return 'https://cdn-icons-png.flaticon.com/512/52/52011.png';
};

const obterFotoJogadorUrl = (fotoUrlCustom?: string) => {
    if (fotoUrlCustom && fotoUrlCustom.trim() !== '') {
        return fotoUrlCustom;
    }
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
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
    const [salarioEdicao, setSalarioEdicao] = useState<string>('');
    const [fotoUrlEdicao, setFotoUrlEdicao] = useState('');
    const [titularEdicao, setTitularEdicao] = useState(false);

    const [equipeEditando, setEquipeEditando] = useState<Equipe | null>(null);
    const [nomeEquipeEdicao, setNomeEquipeEdicao] = useState('');
    const [estadioEdicao, setEstadioEdicao] = useState('');
    const [escudoUrlEdicao, setEscudoUrlEdicao] = useState('');

    const [divisaoEdicao, setDivisaoEdicao] = useState('');
    const [posicaoTabelaEdicao, setPosicaoTabelaEdicao] = useState<number | ''>('');
    const [orcamentoEdicao, setOrcamentoEdicao] = useState<string>('');

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

        const jAny = jogador as any;
        const salBruto = jAny.salario ?? jAny.salarioMensal ?? jAny.valorSalario ?? jAny.salario_mensal ?? jAny.valor_salario ?? '';
        setSalarioEdicao(salBruto !== '' ? String(salBruto) : '');

        setFotoUrlEdicao(jAny.fotoUrl || jAny.foto || '');
        setTitularEdicao(Boolean(jAny.titular ?? jAny.isTitular));
    };

    const salvarEdicao = async () => {
        if (!jogadorEditando || !jogadorEditando.id) return;
        try {
            const salarioLimpo = Number(salarioEdicao.replace(/\D/g, ''));
            const valorSalarioFinal = isNaN(salarioLimpo) ? 0 : salarioLimpo;

            // Mapeia todas as possíveis chaves de salário e titularidade que o backend pode requerer
            const dadosAtualizados = {
                nome: nomeEdicao,
                posicao: posicaoEdicao,
                overall: overallEdicao,
                idade: idadeEdicao,
                salario: valorSalarioFinal,
                salarioMensal: valorSalarioFinal,
                valorSalario: valorSalarioFinal,
                salario_mensal: valorSalarioFinal,
                valor_salario: valorSalarioFinal,
                fotoUrl: fotoUrlEdicao,
                foto: fotoUrlEdicao,
                titular: titularEdicao,
                isTitular: titularEdicao,
                nomeEquipe: equipeSelecionada ?? undefined,
            };

            const jogadorRetornado: Jogador = await atualizarJogador(Number(jogadorEditando.id), dadosAtualizados as any);

            // Garante a integridade do estado local com o valor atualizado
            const jogadorFinal = {
                ...jogadorRetornado,
                salario: valorSalarioFinal,
                salarioMensal: valorSalarioFinal,
                salario_mensal: valorSalarioFinal,
                titular: titularEdicao,
                fotoUrl: fotoUrlEdicao,
                foto: fotoUrlEdicao
            };

            setJogadoresDaEquipa(jogadoresDaEquipa.map(j => j.id === jogadorFinal.id ? jogadorFinal : j));
            setJogadorEditando(null);
        } catch (err) {
            console.error("Erro ao atualizar jogador:", err);
        }
    };

    const salvarEdicaoEquipe = async () => {
        if (!equipeEditando || !equipeEditando.id) return;
        try {
            const orcamentoLimpo = Number(orcamentoEdicao.replace(/\D/g, ''));

            const equipeAtualizada = await atualizarEquipe(equipeEditando.id, {
                nome: nomeEquipeEdicao,
                estadio: estadioEdicao,
                escudoUrl: escudoUrlEdicao,
                divisao: divisaoEdicao,
                posicaoTabela: posicaoTabelaEdicao === '' ? null : Number(posicaoTabelaEdicao),
                orcamento: isNaN(orcamentoLimpo) ? 0 : orcamentoLimpo,
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

    const ordemPosicoes: { [key: string]: number } = {
        'goleiro': 1,
        'zagueiro': 2,
        'lateral': 3,
        'volante': 4,
        'meia': 5,
        'atacante': 6
    };

    const jogadoresOrdenados = [...jogadoresDaEquipa].sort((a, b) => {
        const posA = a.posicao ? a.posicao.toLowerCase().trim() : '';
        const posB = b.posicao ? b.posicao.toLowerCase().trim() : '';
        const pesoA = ordemPosicoes[posA] || 99;
        const pesoB = ordemPosicoes[posB] || 99;
        return pesoA - pesoB;
    });

    return (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', color: '#f1f5f9', border: '1px solid #334155' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Equipas Registradas (Clica numa equipa)</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem', alignItems: 'stretch' }}>
                {equipes.map(eq => {
                    const eqAny = eq as any;
                    const orcamentoValor = eqAny.orcamento ?? 0;

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

                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.813rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <span>🏆</span> <span>{eq.divisao || 'Série A'} — {eq.posicaoTabela ? `${eq.posicaoTabela}º lugar` : 'Posição não definida'}</span>
                                </p>

                                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <span>💰</span> <span>Orçamento: R$ {Number(orcamentoValor || 0).toLocaleString('pt-BR')}</span>
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
                                    setOrcamentoEdicao(orcamentoValor !== '' ? String(orcamentoValor) : '');
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
                    <h4 style={{ marginTop: 0, color: '#38bdf8' }}>Plantel de {equipeSelecionada} (Organizado por Posição)</h4>
                    {jogadoresDaEquipa.length === 0 ? (
                        <p style={{ color: '#94a3b8', margin: 0 }}>Nenhum jogador contratado para esta equipa ainda.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {jogadoresOrdenados.map((jogador: Jogador) => {
                                const jAny = jogador as any;
                                const isTitular = Boolean(jAny.titular ?? jAny.isTitular);
                                const fotoUrlFinal = jAny.fotoUrl || jAny.foto;
                                const salarioValor = jAny.salario ?? jAny.salarioMensal ?? jAny.valorSalario ?? jAny.salario_mensal ?? jAny.valor_salario ?? 0;

                                return (
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: '#0f172a',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '1px solid #334155'
                                            }}>
                                                <img
                                                    src={obterFotoJogadorUrl(fotoUrlFinal)}
                                                    alt={`Foto de ${jogador.nome}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e)=>{
                                                        (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <strong>{jogador.nome}</strong>
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        padding: '0.1rem 0.4rem',
                                                        borderRadius: '0.25rem',
                                                        fontWeight: '700',
                                                        background: isTitular ? '#0284c7' : '#475569',
                                                        color: '#fff'
                                                    }}>
                                                        {isTitular ? 'TITULAR' : 'RESERVA'}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>
                                                    {jogador.posicao} — Overall: {jogador.overall}, {jogador.idade} anos
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block', marginTop: '0.1rem' }}>
                                                    Salário: R$ {Number(salarioValor || 0).toLocaleString('pt-BR')}
                                                </span>
                                            </div>
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
                                                            await deletarJogador(jogador.id as any);
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
                                );
                            })}
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

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Orçamento:</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 50000000"
                                    value={orcamentoEdicao}
                                    onChange={e => {
                                        const apenasNumeros = e.target.value.replace(/\D/g, '');
                                        setOrcamentoEdicao(apenasNumeros);
                                    }}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem', display: 'block' }}>
                                    Valor real: R$ {orcamentoEdicao ? Number(orcamentoEdicao).toLocaleString('pt-BR') : '0'}
                                </span>
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
                    <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #334155', width: '400px', color: '#f1f5f9', maxHeight: '90vh', overflowY: 'auto' }}>
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

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Salário:</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 1500000"
                                    value={salarioEdicao}
                                    onChange={e => {
                                        const apenasNumeros = e.target.value.replace(/\D/g, '');
                                        setSalarioEdicao(apenasNumeros);
                                    }}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem', display: 'block' }}>
                                    Valor real: R$ {salarioEdicao ? Number(salarioEdicao).toLocaleString('pt-BR') : '0'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <input
                                    type="checkbox"
                                    id="titularCheckbox"
                                    checked={titularEdicao}
                                    onChange={e => setTitularEdicao(e.target.checked)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="titularCheckbox" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                                    Jogador Titular
                                </label>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>URL da Foto (Opcional):</label>
                                <input
                                    type="text"
                                    placeholder="Ex: https://site.com/jogador.png"
                                    value={fotoUrlEdicao}
                                    onChange={e => setFotoUrlEdicao(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '0.375rem' }}
                                />
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