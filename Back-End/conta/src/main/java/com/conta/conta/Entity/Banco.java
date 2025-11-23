//Banco - multiplas contas bancarias do usuario
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
    private String chavePix;

    @Column(nullable = false)
    private boolean status;

    @JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @ManyToOne
    @JoinColumn(name = "conta_id", nullable = false) // Define o nome da coluna de chave estrangeira
    @JsonIgnore // Evita loop infinito no Json
    private Conta conta;

    @Column(nullable = false)
    private boolean permitirTransacao;

    @Column
    private String bancoUrl;

    public Banco(String titular, String nomeBanco, float saldo, String chavePix) {
        this.titular = titular;
        this.nomeBanco = nomeBanco;
        this.saldo = saldo;
        this.chavePix = chavePix;
    }

    public Banco(){
    }

    @PrePersist
    protected void onCreate(){
        dataCadastro = LocalDateTime.now();
        status = true;
        permitirTransacao = true;
        bancoUrl = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_account_balance_48px-512.png";
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

    public String getChavePix() {
        return chavePix;
    }
    public void setChavePix(String chavePix) {
        this.chavePix = chavePix;
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

    public boolean isPermitirTransacao() {
        return permitirTransacao;
    }

    public void setPermitirTransacao(boolean permitirTransacao) {
        this.permitirTransacao = permitirTransacao;
    }

    public String getBancoUrl() {
        return bancoUrl;
    }

    public void setBancoUrl(String bancoUrl) {
        this.bancoUrl = bancoUrl;
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
                '}';
    }
}
