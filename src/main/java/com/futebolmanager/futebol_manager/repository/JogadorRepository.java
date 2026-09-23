package com.futebolmanager.futebol_manager.repository;

import com.futebolmanager.futebol_manager.model.Jogador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JogadorRepository  extends JpaRepository<Jogador, Long>{
    // Aqui poderemos adicionar consultas personalizadas futuramente, se necessário.

    @Query("SELECT COUNT(j) FROM Jogador j WHERE j.equipe.id = :equipeId")
    long countByEquipeId(@Param("equipeId") Long equipeId);

    List<Jogador> findByEquipeId(Long equipeId);
    // ou por nome, caso prefiras manter a consistência textual:
    List<Jogador> findByEquipeNome(String nomeEquipe);
}
