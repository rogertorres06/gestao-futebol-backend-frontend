package com.futebolmanager.futebol_manager.repository;

import com.futebolmanager.futebol_manager.model.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {

    Optional<Equipe> findByNome(String nome);

    // ADICIONE ESTA LINHA: O Spring Data JPA traduz isso para a query correta automaticamente
    Optional<Equipe> findByApiId(Long apiId);

    @Query("SELECT e FROM Equipe e LEFT JOIN FETCH e.jogadores")
    List<Equipe> findAllComJogadores();

    @Query("SELECT e FROM Equipe e LEFT JOIN FETCH e.jogadores WHERE e.id = :id")
    Optional<Equipe> findByIdComJogadores(@Param("id") Long id);

    // Adicione no EquipeRepository.java
    List<Equipe> findAllByOrderByPosicaoTabelaAsc();
}