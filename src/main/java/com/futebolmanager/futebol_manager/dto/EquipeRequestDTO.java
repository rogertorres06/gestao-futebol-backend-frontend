package com.futebolmanager.futebol_manager.dto;

import jakarta.validation.constraints.NotBlank;

public class EquipeRequestDTO {

    @NotBlank(message = "O nome da equipa é obrigatório.")
    private String nome;

    @NotBlank(message = "O estádio da equipa é obrigatório.")
    private String estadio;

    private String divisao;
    private Integer posicaoTabela;


    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEstadio() { return estadio; }
    public void setEstadio(String estadio) { this.estadio = estadio; }

    public String getDivisao() { return divisao; }
    public void setDivisao(String divisao) { this.divisao = divisao; }

    public Integer getPosicaoTabela() { return posicaoTabela; }
    public void setPosicaoTabela(Integer posicaoTabela) { this.posicaoTabela = posicaoTabela; }

}