package com.conta.conta.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

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

    // Conta que fez a transação (sempre obrigatória)
    @ManyToOne
    @JoinColumn(name = "conta_origem_id", nullable = false)
    private Conta contaOrigem;

    // Banco da conta de origem
    @ManyToOne
    @JoinColumn(name = "banco_origem_id", nullable = false)
    private Banco bancoOrigem;

    // Conta destino (somente se for transferência)
    @ManyToOne
    @JoinColumn(name = "conta_destino_id", nullable = true)
    private Conta contaDestino;

    // Banco destino
    @ManyToOne
    @JoinColumn(name = "banco_destino_id", nullable = true)
    private Banco bancoDestino;

    // ============================
    // CONSTRUTORES
    // ============================
    public Transacao() {}

    public Transacao(
            float valor,
            String descricao,
            Conta contaOrigem,
            Banco bancoOrigem,
            Conta contaDestino,
            Banco bancoDestino
    ) {
        this.valor = valor;
        this.descricao = descricao;
        this.contaOrigem = contaOrigem;
        this.bancoOrigem = bancoOrigem;
        this.contaDestino = contaDestino;
        this.bancoDestino = bancoDestino;
    }

    @PrePersist
    protected void onCreate() {
        dataTransacao = LocalDateTime.now();
    }

    // ============================
    // GETTERS & SETTERS
    // ============================

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

    public Conta getContaOrigem() {
        return contaOrigem;
    }

    public void setContaOrigem(Conta contaOrigem) {
        this.contaOrigem = contaOrigem;
    }

    public Conta getContaDestino() {
        return contaDestino;
    }

    public void setContaDestino(Conta contaDestino) {
        this.contaDestino = contaDestino;
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

    // ============================
    // TO STRING (com NPE seguro)
    // ============================

    @Override
    public String toString() {
        return "Transacao{" +
                "id=" + id +
                ", valor=" + valor +
                ", descricao='" + descricao + '\'' +
                ", dataTransacao=" + dataTransacao +
                ", contaOrigem=" + (contaOrigem != null ? contaOrigem.getTitular() : "null") +
                ", bancoOrigem=" + (bancoOrigem != null ? bancoOrigem.getNomeBanco() : "null") +
                ", contaDestino=" + (contaDestino != null ? contaDestino.getTitular() : "null") +
                ", bancoDestino=" + (bancoDestino != null ? bancoDestino.getNomeBanco() : "null") +
                '}';
    }
}
