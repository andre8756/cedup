package com.conta.conta.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

// Lista de Transacoes do usuario
@Entity
@Table(name = "tb_transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private float valor;

    @Column(nullable = false)
    private String descricao;

    @JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataTransacao;

    @ManyToOne
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @ManyToOne
    @JoinColumn(name = "banco_origem_id", nullable = false)
    private Banco bancoOrigem;

    @ManyToOne
    @JoinColumn(name = "banco_destino_id", nullable = false)
    private Banco bancoDestino;

    public Transacao(float valor, String descricao, Conta conta, Banco bancoOrigem, Banco bancoDestino){
        this.valor = valor;
        this.descricao = descricao;
        this.conta = conta;
        this.bancoOrigem = bancoOrigem;
        this.bancoDestino = bancoDestino;
    }

    public Transacao(){
    }

    @PrePersist
    protected void onCreate(){
        dataTransacao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public float getValor() {
        return valor;
    }

    public void setValor(float valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDateTime dataTransacao) {
        this.dataTransacao = dataTransacao;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public Banco getBancoOrigem() {
        return bancoOrigem;
    }

    public void setBancoOrigem(Banco bancoOrigem) {
        this.bancoOrigem = bancoOrigem;
    }

    public Banco getBancoDestino() {
        return bancoDestino;
    }

    public void setBancoDestino(Banco bancoDestino) {
        this.bancoDestino = bancoDestino;
    }

    @Override
    public String toString() {
        return "Transacao{" +
                "id=" + id +
                ", valor=" + valor +
                ", descricao='" + descricao + '\'' +
                ", dataTransacao=" + dataTransacao +
                ", conta=" + conta.getTitular() +
                ", bancoOrigem=" + bancoOrigem.getNomeBanco() +
                ", bancoDestino=" + bancoDestino.getNomeBanco() +
                '}';
    }


}
