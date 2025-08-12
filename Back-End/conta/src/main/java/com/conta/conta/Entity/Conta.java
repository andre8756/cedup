package com.conta.conta.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_contas")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String proprietario;

    @Column(nullable = false)
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



    public Conta(String proprietario, LocalDateTime dataCadastro, String email, String telefone, String senha, float saldoTotal, String cpf, Boolean status) {
        this.proprietario = proprietario;
        this.dataCadastro = LocalDateTime.now();
        this.email = email;
        this.telefone = telefone;
        this.senha = senha;
        this.saldoTotal = saldoTotal;
        this.cpf = cpf;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getProprietario() {
        return proprietario;
    }

    public void setProprietario(String proprietario) {
        this.proprietario = proprietario;
    }

    public LocalDateTime getData() {
        return dataCadastro;
    }

    public void setData(LocalDateTime dataCadastro) {
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
                ", proprietario='" + proprietario + '\'' +
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
