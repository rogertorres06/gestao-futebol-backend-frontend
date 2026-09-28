package com.futebolmanager.futebol_manager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "tb_jogadores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Jogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private int idade;
    private String posicao;
    private int overall;

    @Column(name = "salario")
    private BigDecimal salario;

    @Column(name = "numero_camisa")
    private Integer numeroCamisa;

    @Column(nullable = false)
    private Boolean titular = false;

    @Column(name = "foto_url")
    private String fotoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipe_id")
    @JsonIgnore
    private Equipe equipe;
}