package com.conta.conta.Entitys;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_contas")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String proprietario;

    @Column(nullable = false)
    private LocalDate data;

}
