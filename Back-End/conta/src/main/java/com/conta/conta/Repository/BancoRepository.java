package com.conta.conta.Repository;

import com.conta.conta.Entity.Banco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BancoRepository extends JpaRepository<Banco, Long> {
    List<Banco> findByContaId(Long contaid);
}
