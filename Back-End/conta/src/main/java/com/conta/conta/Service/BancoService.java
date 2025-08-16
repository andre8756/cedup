package com.conta.conta.Service;

import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.BancoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BancoService {

    @Autowired
    BancoRepository bancoRepository;

    @Autowired
    ContaService contaService;

    public Banco salvar(Banco banco){
        Conta conta = banco.getConta();
        conta.setSaldoTotal(conta.getSaldoTotal() + banco.getSaldo());
        return bancoRepository.save(banco);
    }

    public List<Banco> listarBanco(){
        return bancoRepository.findAll();
    }

    public Optional<Banco> buscarPorId(Long id){
        return bancoRepository.findById(id);
    }

    public void removerPorId(Long id){
        bancoRepository.deleteById(id);
    }

}
