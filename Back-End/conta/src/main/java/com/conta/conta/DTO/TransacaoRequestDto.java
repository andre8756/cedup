package com.conta.conta.DTO;

import java.time.LocalDateTime;

public class TransacaoRequestDto {

    private Long id;
    private Long contaOrigemId;
    private Long bancoOrigemId;
    private String bancoOrigemNome;
    private String bancoOrigemTitular;
    private Long contaDestinoId;
    private Long bancoDestinoId;
    private String bancoDestinoNome;
    private String bancoDestinoTitular;
    private float valor;
    private String descricao;
    private LocalDateTime dataTransacao;

    public TransacaoRequestDto(Long id, Long contaOrigemId, Long bancoOrigemId, String bancoOrigemNome, String bancoOrigemTitular, Long contaDestinoId, Long bancoDestinoId, String bancoDestinoNome, String bancoDestinoTitular, float valor, String descricao, LocalDateTime dataTransacao) {
        this.id = id;
        this.contaOrigemId = contaOrigemId;
        this.bancoOrigemId = bancoOrigemId;
        this.bancoOrigemNome = bancoOrigemNome;
        this.bancoOrigemTitular = bancoOrigemTitular;
        this.contaDestinoId = contaDestinoId;
        this.bancoDestinoId = bancoDestinoId;
        this.bancoDestinoNome = bancoDestinoNome;
        this.bancoDestinoTitular = bancoDestinoTitular;
        this.valor = valor;
        this.descricao = descricao;
        this.dataTransacao = dataTransacao;
    }

    public TransacaoRequestDto(Long id, Long contaOrigemId, Long bancoOrigemId, Long contaDestinoId, Long bancoDestinoId, float valor, String descricao, LocalDateTime dataTransacao) {
        this.id = id;
        this.contaOrigemId = contaOrigemId;
        this.bancoOrigemId = bancoOrigemId;
        this.contaDestinoId = contaDestinoId;
        this.bancoDestinoId = bancoDestinoId;
        this.valor = valor;
        this.descricao = descricao;
        this.dataTransacao = dataTransacao;
    }

    public TransacaoRequestDto(Long id, Long contaOrigemId, Long bancoOrigemId, float valor, String descricao, LocalDateTime dataTransacao) {
        this.id = id;
        this.contaOrigemId = contaOrigemId;
        this.bancoOrigemId = bancoOrigemId;
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
    public Long getBancoOrigemId() { return bancoOrigemId; }
    public void setBancoOrigemId(Long bancoOrigemId) { this.bancoOrigemId = bancoOrigemId; }
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
    public Long getBancoDestinoId() { return bancoDestinoId; }
    public void setBancoDestinoId(Long bancoDestinoId) { this.bancoDestinoId = bancoDestinoId; }
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
