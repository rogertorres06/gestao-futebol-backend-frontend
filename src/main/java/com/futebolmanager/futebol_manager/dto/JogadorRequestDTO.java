package com.futebolmanager.futebol_manager.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JogadorRequestDTO {

    @NotBlank(message = "O nome do jogador não pode estar em branco.")
    private String nome;

    @NotBlank(message = "A posição do jogador é obrigatória.")
    private String posicao;

    @NotNull(message = "A idade é obrigatória.")
    @Min(value = 15, message = "A idade mínima permitida é 15 anos.")
    @Max(value = 50, message = "A idade máxima permitida é 50 anos.")
    private Integer idade;

    @NotNull(message = "O overall é obrigatório.")
    @Min(value = 0, message = "O overall mínimo é 0.")
    @Max(value = 99, message = "O overall máximo é 99.")
    private Integer overall;

    @NotBlank(message = "O nome da equipe é obrigatório.")
    private String nomeEquipe;

    public String getNomeEquipe() {
        return nomeEquipe;
    }

    public void setNomeEquipe(String nomeEquipe) {
        this.nomeEquipe = nomeEquipe;
    }

    // CONSTRUTOR VAZIO OBRIGATÓRIO PARA O JACKSON
    public JogadorRequestDTO() {
    }

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getPosicao() { return posicao; }
    public void setPosicao(String posicao) { this.posicao = posicao; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

    public Integer getOverall() { return overall; }
    public void setOverall(Integer overall) { this.overall = overall; }


}
