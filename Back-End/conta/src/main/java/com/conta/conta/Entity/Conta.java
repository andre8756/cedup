package com.conta.conta.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//Conta principal do usuário
@Entity
@Table(name = "tb_contas")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titular;

    @Column(nullable = false)
    private String cpf;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private float saldoTotal;

    @Column(nullable = false)
    private Boolean status;

    @JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @OneToMany(mappedBy = "conta", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true) // Remove a tabela de junção
    private List<Banco> bancos = new ArrayList<>();

    public Conta(String titular, String email, String telefone, String senha, String cpf, List<Banco> bancos) {
        this.titular = titular;
        this.email = email;
        this.telefone = telefone;
        this.senha = senha;
        this.saldoTotal = 0;
        this.cpf = cpf;
        this.bancos = bancos;
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

    public List<Banco> getBancos(){
        return bancos;
    }

    public void setBancos(List<Banco> bancos){
        this.bancos = bancos;
    }

    @Override
    public String toString() {
        return "Conta{" +
                "id=" + id +
                ", titular='" + titular + '\'' +
                ", cpf='" + cpf + '\'' +
                ", email='" + email + '\'' +
                ", senha='" + senha + '\'' +
                ", telefone='" + telefone + '\'' +
                ", saldoTotal=" + saldoTotal +
                ", status=" + status +
                ", dataCadastro=" + dataCadastro +
                '}';
    }
}
