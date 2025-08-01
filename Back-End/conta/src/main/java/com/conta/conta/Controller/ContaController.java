package com.conta.conta.Controller;

import com.conta.conta.Entity.Conta;
import com.conta.conta.Service.ContaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/conta")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Conta> listaConta(){
        return contaService.listarConta();
    }

    //Buscar conta específica
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Conta buscarConta(@PathVariable("id") Long id){
        return contaService.buscarPorId(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
    }

    @PostMapping //Identifica que metodo a API deve executar ao fazer um POST
    @ResponseStatus(HttpStatus.CREATED) //Responde o resultado do post 201
    public Conta salvar(@RequestBody Conta conta){
        return contaService.salvar(conta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerCliente(@PathVariable("id") Long id){
        contaService.buscarPorId(id).map(conta -> {
            contaService.removerPorId(conta.getId());
            return Void.TYPE;
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada!"));
    }



}
