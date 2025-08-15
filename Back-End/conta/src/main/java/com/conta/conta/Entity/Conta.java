package com.conta.conta.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_contas")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titular;

    @JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private float saldoTotal;

    @Column(nullable = false)
    private String cpf;

    @Column(nullable = false)
    private Boolean status;

    public Conta(String titular, String email, String telefone, String senha, String cpf) {
        this.titular = titular;
        this.email = email;
        this.telefone = telefone;
        this.senha = senha;
        this.saldoTotal = 0;
        this.cpf = cpf;
    }

    public Conta(){

    }

    @PrePersist
    protected void onCreate(){
        dataCadastro = LocalDateTime.now();
        status = true;
    }

    public Long getId() {
        return id;
    }

    public String getTitular() {
        return titular;
    }

    public void setTitular(String proprietario) {
        this.titular = proprietario;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public float getSaldoTotal() {
        return saldoTotal;
    }

    public void setSaldoTotal(float saldoTotal) {
        this.saldoTotal = saldoTotal;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Conta{" +
                "id=" + id +
                ", titular='" + titular + '\'' +
                ", data=" + dataCadastro +
                ", email='" + email + '\'' +
                ", telefone='" + telefone + '\'' +
                ", senha='" + senha + '\'' +
                ", saldoTotal=" + saldoTotal +
                ", cpf='" + cpf + '\'' +
                ", status=" + status +
                '}';
    }
}
