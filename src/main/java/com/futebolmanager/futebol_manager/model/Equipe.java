package com.futebolmanager.futebol_manager.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name= "tb_equipes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "api_id", unique = true)
    private Long apiId;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String estadio;

    @Column(columnDefinition = "TEXT")
    private String escudoUrl;
    private String corPrimaria;

    @Column(precision = 15, scale = 2)
    private BigDecimal orcamento = BigDecimal.ZERO;

    @Column(name = "divisao")
    private String divisao;

    @Column(name = "posicao_tabela")
    private Integer posicaoTabela;

    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("equipe") // <-- Ignora a serialização do campo 'equipe' dentro de cada jogador para evitar loop/proxy
    private List<Jogador> jogadores = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Equipe equipe = (Equipe) o;
        return id != null && id.equals(equipe.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}