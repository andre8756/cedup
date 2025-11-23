package com.conta.conta.DTO;

import java.time.LocalDateTime;

public class TransacaoResponseDto {

    private Long id;

    private Long contaOrigemId;
    private String bancoOrigemChavePix;
    private String bancoOrigemNome;
    private String bancoOrigemTitular;

    private Long contaDestinoId;
    private String bancoDestinoChavePix;
    private String bancoDestinoNome;
    private String bancoDestinoTitular;

    private float valor;
    private String descricao;
    private LocalDateTime dataTransacao;

    public TransacaoResponseDto(
            Long id,
            Long contaOrigemId,
            String bancoOrigemChavePix,
            String bancoOrigemNome,
            String bancoOrigemTitular,
            Long contaDestinoId,
            String bancoDestinoChavePix,
            String bancoDestinoNome,
            String bancoDestinoTitular,
            float valor,
            String descricao,
            LocalDateTime dataTransacao
    ) {
        this.id = id;
        this.contaOrigemId = contaOrigemId;
        this.bancoOrigemChavePix = bancoOrigemChavePix;
        this.bancoOrigemNome = bancoOrigemNome;
        this.bancoOrigemTitular = bancoOrigemTitular;
        this.contaDestinoId = contaDestinoId;
        this.bancoDestinoChavePix = bancoDestinoChavePix;
        this.bancoDestinoNome = bancoDestinoNome;
        this.bancoDestinoTitular = bancoDestinoTitular;
        this.valor = valor;
        this.descricao = descricao;
        this.dataTransacao = dataTransacao;
    }


    // Getters e Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getBancoDestinoChavePix() {
        return bancoDestinoChavePix;
    }
    public void setBancoDestinoChavePix(String bancoDestinoChavePix) {
        this.bancoDestinoChavePix = bancoDestinoChavePix;
    }
    public String getBancoOrigemNome() {
        return bancoOrigemNome;
    }
    public void setBancoOrigemNome(String bancoOrigemNome) {
        this.bancoOrigemNome = bancoOrigemNome;
    }
    public String getBancoOrigemTitular() {
        return bancoOrigemTitular;
    }
    public void setBancoOrigemTitular(String bancoOrigemTitular) {
        this.bancoOrigemTitular = bancoOrigemTitular;
    }
    public String getBancoOrigemChavePix() {
        return bancoOrigemChavePix;
    }
    public void setBancoOrigemChavePix(String bancoOrigemChavePix) {
        this.bancoOrigemChavePix = bancoOrigemChavePix;
    }
    public String getBancoDestinoNome() {
        return bancoDestinoNome;
    }
    public void setBancoDestinoNome(String bancoDestinoNome) {
        this.bancoDestinoNome = bancoDestinoNome;
    }
    public String getBancoDestinoTitular() {
        return bancoDestinoTitular;
    }
    public void setBancoDestinoTitular(String bancoDestinoTitular) {
        this.bancoDestinoTitular = bancoDestinoTitular;
    }
    public float getValor() { return valor; }
    public void setValor(float valor) { this.valor = valor; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Long getContaOrigemId() {
        return contaOrigemId;
    }
    public void setContaOrigemId(Long contaId) {
        this.contaOrigemId = contaId;
    }
    public Long getContaDestinoId() {
        return contaDestinoId;
    }
    public void setContaDestinoId(Long contaId) {
        this.contaDestinoId = contaId;
    }
    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }
    public void setDataTransacao(LocalDateTime dataTransacao) {
        this.dataTransacao = dataTransacao;
    }
}
