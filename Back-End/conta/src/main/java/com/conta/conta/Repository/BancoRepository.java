package com.conta.conta.Repository;

import com.conta.conta.Entity.Banco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BancoRepository extends JpaRepository<Banco, Long> {

    List<Banco> findByContaId(Long contaid);
    Optional<Banco> findByChavePix(String chavePix);
    List<Banco> findByContaIdAndPermitirTransacao(Long contaId, boolean permitirTransacao);

}
