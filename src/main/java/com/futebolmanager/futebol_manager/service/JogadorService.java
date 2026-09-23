package com.futebolmanager.futebol_manager.service;

import com.futebolmanager.futebol_manager.dto.JogadorRequestDTO;
import com.futebolmanager.futebol_manager.model.Equipe;
import com.futebolmanager.futebol_manager.model.Jogador;
import com.futebolmanager.futebol_manager.repository.EquipeRepository;
import com.futebolmanager.futebol_manager.repository.JogadorRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JogadorService {

    private final JogadorRepository jogadorRepository;
    private final EquipeRepository equipeRepository;

    private static final int LIMITE_MAXIMO_ELENCO = 32;

    public JogadorService(JogadorRepository jogadorRepository, EquipeRepository equipeRepository) {
        this.jogadorRepository = jogadorRepository;
        this.equipeRepository = equipeRepository;
    }

    public List<Jogador> listarPorEquipe(Long equipeId) {
        return jogadorRepository.findByEquipeId(equipeId);
    }

    // Cadastro via DTO utilizando o NOME da equipe em vez do ID
    @Transactional
    public Jogador salvar(JogadorRequestDTO dto) {
        if (dto.getNomeEquipe() == null || dto.getNomeEquipe().trim().isEmpty()) {
            throw new IllegalArgumentException("Violação de regra: O nome da equipe é obrigatório para realizar a contratação.");
        }

        if (dto.getOverall() < 0 || dto.getOverall() > 99) {
            throw new IllegalArgumentException("O overall do jogador deve estar estritamente entre 0 e 99.");
        }

        // Busca a equipe pelo nome fornecido no DTO
        Equipe equipeValida = equipeRepository.findByNome(dto.getNomeEquipe())
                .orElseThrow(() -> new RuntimeException("Contratação abortada: A equipe '" + dto.getNomeEquipe() + "' não existe no banco de dados."));

        long totalJogadoresNaEquipe = jogadorRepository.countByEquipeId(equipeValida.getId());

        if (totalJogadoresNaEquipe >= LIMITE_MAXIMO_ELENCO) {
            throw new IllegalStateException("Contratação impedida pelo teto do clube: A equipe " + equipeValida.getNome() + " já atingiu o limite máximo de " + LIMITE_MAXIMO_ELENCO + " jogadores.");
        }

        Jogador jogador = new Jogador();
        jogador.setNome(dto.getNome());
        jogador.setPosicao(dto.getPosicao());
        jogador.setIdade(dto.getIdade());
        jogador.setOverall(dto.getOverall());
        jogador.setEquipe(equipeValida);

        return jogadorRepository.save(jogador);
    }

    // Sobrecarga mantida intacta e corrigida
    @Transactional
    public Jogador salvar(Jogador jogador) {
        if (jogador.getOverall() < 0 || jogador.getOverall() > 99) {
            throw new IllegalArgumentException("O overall do jogador deve estar estritamente entre 0 e 99.");
        }

        if (jogador.getEquipe() == null || jogador.getEquipe().getId() == null) {
            throw new IllegalArgumentException("Violação de regra: Nenhum jogador pode ser contratado sem estar vinculado a uma Equipe.");
        }

        Long equipeId = jogador.getEquipe().getId();

        Equipe equipeValida = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Contratação abortada: A equipe com ID " + equipeId + " não existe."));

        long totalJogadoresNaEquipe = jogadorRepository.countByEquipeId(equipeId);
        System.out.println(">>> CONTAGEM ATUAL PARA A EQUIPE " + equipeId + ": " + totalJogadoresNaEquipe);

        if (totalJogadoresNaEquipe >= LIMITE_MAXIMO_ELENCO) {
            throw new IllegalStateException("Contratação impedida pelo teto do clube: A equipe " + equipeValida.getNome() + " já atingiu o limite máximo de " + LIMITE_MAXIMO_ELENCO + " jogadores.");
        }

        jogador.setEquipe(equipeValida);

        return jogadorRepository.save(jogador);
    }

    public List<Jogador> listarTodos() {
        return jogadorRepository.findAll();
    }

    public Optional<Jogador> buscarPorId(Long id) {
        return jogadorRepository.findById(id);
    }

    public void deletar(Long id) {
        if (!jogadorRepository.existsById(id)) {
            throw new RuntimeException("Tentativa de eliminação falhou: O jogador com ID " + id + " não existe.");
        }
        jogadorRepository.deleteById(id);
    }

    @Transactional
    public Jogador atualizar(Long id, JogadorRequestDTO dto) {
        Jogador jogador = jogadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jogador não encontrado para atualização."));

        if (dto.getOverall() < 0 || dto.getOverall() > 99) {
            throw new IllegalArgumentException("O overall do jogador deve estar estritamente entre 0 e 99.");
        }

        jogador.setNome(dto.getNome());
        jogador.setPosicao(dto.getPosicao());
        jogador.setOverall(dto.getOverall());
        jogador.setIdade(dto.getIdade());

        if (dto.getNomeEquipe() != null && !dto.getNomeEquipe().trim().isEmpty()) {
            Equipe equipeValida = equipeRepository.findByNome(dto.getNomeEquipe())
                    .orElseThrow(() -> new RuntimeException("Equipe '" + dto.getNomeEquipe() + "' não encontrada."));
            jogador.setEquipe(equipeValida);
        }

        return jogadorRepository.save(jogador);
    }
}