package com.conta.conta.Service;

import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    @Autowired
    ContaRepository contaRepository;

    public Conta salvar(Conta conta) {
        return contaRepository.save(conta);
    }

    public List<Conta> listarConta(){
        return contaRepository.findAll();
    }

    public Optional<Conta> buscarPorId(Long id){
        return contaRepository.findById(id);
    }

    public void removerPorId(Long id){
        contaRepository.deleteById(id);
    }

}
