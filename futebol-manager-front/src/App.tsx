import EquipeForm from './components/EquipeForm';
import JogadorForm from './components/JogadorForm';
import EquipeList from './components/EquipeList';

export default function App() {
    return (
        <div style={{
            padding: '3rem',
            background: '#0f172a',
            color: '#f8fafc',
            minHeight: '100vh',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', margin: 0 }}>
                    Football Manager <span style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: '500' }}>// Painel de Controlo</span>
                </h1>
                <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Gestão integrada de alta performance com Spring Boot & React</p>
            </header>

            {/* PAINEL DE FORMULÁRIOS: EQUIPAS E JOGADORES LADO A LADO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                <EquipeForm onEquipeCriada={() => window.location.reload()} />
                <JogadorForm onJogadorCriado={() => console.log("Contratação efetuada com sucesso.")} />
            </div>

            {/* LISTAGEM INTERATIVA DE EQUIPAS E SEUS PLANTEIS */}
            <EquipeList />
        </div>
    );
}