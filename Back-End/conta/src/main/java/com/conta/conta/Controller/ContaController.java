package com.conta.conta.Controller;

import com.conta.conta.Entity.Conta;
import com.conta.conta.Service.ContaService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/conta")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @Autowired
    private ModelMapper modelMapper;

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

    //Método Post para criação
    @PostMapping //Identifica que metodo a API deve executar ao fazer um POST
    @ResponseStatus(HttpStatus.CREATED) //Responde o resultado do post 201
    public Conta salvar(@RequestBody Conta conta){
        return contaService.salvar(conta);
    }

    // Método PUT para atualização
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarConta(@PathVariable("id") Long id, @RequestBody Conta conta){
        contaService.buscarPorId(id)
                .map(contaBase -> {
                    modelMapper.map(conta, contaBase);
                    contaService.salvar(contaBase);
                    return Void.TYPE;
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nao encontrado"));
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
