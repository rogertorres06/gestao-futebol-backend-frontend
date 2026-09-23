package com.futebolmanager.futebol_manager.service;

import com.futebolmanager.futebol_manager.model.Equipe;
import com.futebolmanager.futebol_manager.repository.EquipeRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipeService {

    private final EquipeRepository equipeRepository;

    public EquipeService(EquipeRepository equipeRepository){
        this.equipeRepository = equipeRepository;
    }

    public Equipe salvar(Equipe equipe){
        if (equipe.getNome() == null || equipe.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da equipe é um parâmetro inegociável e não pode estar vazio.");
        }
        return equipeRepository.save(equipe);
    }

    public List<Equipe> listarTodosOrdenados() {
        return equipeRepository.findAllByOrderByPosicaoTabelaAsc();
    }

    public List<Equipe> listarTodos(){
        return equipeRepository.findAll();
    }

    public Optional<Equipe> bsucarPorId(Long id){
        return equipeRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Equipe> buscarEquipeComJogadores(Long id) {
        return equipeRepository.findById(id);
    }

    public void deletar(Long id){
        if(!equipeRepository.existsById(id)){
            throw new RuntimeException("Falha operacional: A equipe com ID " + id + " não existe para ser extinta.");
        }
        equipeRepository.deleteById(id);
    }

    @Transactional
    public Equipe atualizar(Long id, Equipe equipeAtualizada){
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Falha operacional: A equipe com ID " + id + " não existe para ser atualizada."));

        equipe.setNome(equipeAtualizada.getNome());
        equipe.setEstadio(equipeAtualizada.getEstadio());
        equipe.setDivisao(equipeAtualizada.getDivisao());
        equipe.setPosicaoTabela(equipeAtualizada.getPosicaoTabela());
        equipe.setOrcamento(equipeAtualizada.getOrcamento());
        equipe.setCorPrimaria(equipeAtualizada.getCorPrimaria());
        equipe.setEscudoUrl(equipeAtualizada.getEscudoUrl());

        return equipeRepository.save(equipe);
    }
}