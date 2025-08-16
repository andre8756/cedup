package com.conta.conta.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_bancos")
public class Banco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titular;

    @Column(nullable = false)
    private String nomeBanco;

    @Column(nullable = false)
    private float saldo;

    @Column(nullable = false)
    private boolean status;

    @JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @ManyToOne
    @JoinColumn(name = "conta_id", nullable = false) // Define o nome da coluna de chave estrangeira
    @JsonIgnore // Evita loop infinito no Json
    private Conta conta;

    public Banco(String titular, String nomeBanco, float saldo) {
        this.titular = titular;
        this.nomeBanco = nomeBanco;
        this.saldo = saldo;
    }

    public Banco(){
    }

    @PrePersist
    protected void onCreate(){
        dataCadastro = LocalDateTime.now();
        status = true;
    }

    public Long getId(){
        return id;
    }

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public String getNomeBanco() {
        return nomeBanco;
    }

    public void setNomeBanco(String nomeBanco) {
        this.nomeBanco = nomeBanco;
    }

    public float getSaldo() {
        return saldo;
    }

    public void setSaldo(float saldo) {
        this.saldo = saldo;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    @Override
    public String toString() {
        return "Banco{" +
                "id=" + id +
                ", titular='" + titular + '\'' +
                ", nomeBanco='" + nomeBanco + '\'' +
                ", saldo=" + saldo +
                ", status=" + status +
                ", dataCadastro=" + dataCadastro +
                ", conta=" + conta.getTitular() +
                '}';
    }
}
