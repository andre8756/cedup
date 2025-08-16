package com.conta.conta.Controller;

import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Service.BancoService;
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
    private BancoService bancoService;

    @Autowired
    private ModelMapper modelMapper;

    // Conta Principal -------------------------------------------------------------------------
    @GetMapping()
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
    @ResponseStatus(HttpStatus.OK)
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

    // Outras contas bancárias -------------------------------------------------------------------------

    @GetMapping("/banco")
    @ResponseStatus(HttpStatus.OK)
    public List<Banco> listaBanco(){
        return bancoService.listarBanco();
    }

    //Buscar banco específico
    @GetMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Banco buscarBanco(@PathVariable("id") Long id){
        return bancoService.buscarPorId(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrada"));
    }

    //Método Post para criação
    @PostMapping("{id}/banco") //Identifica que metodo a API deve executar ao fazer um POST
    @ResponseStatus(HttpStatus.CREATED) //Responde o resultado do post 201
    public Banco salvar(@PathVariable("id") Long contaId, @RequestBody Banco banco){

        Conta conta = contaService.buscarPorId(contaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada")); // Aqui ele confere se a conta que o usuário apontou existe

        banco.setConta(conta);
        return bancoService.salvar(banco);
    }

    // Método PUT para atualização
    @PutMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizarBanco(@PathVariable("id") Long id, @RequestBody Banco banco){
        bancoService.buscarPorId(id)
                .map(bancoBase -> {
                    modelMapper.map(banco, bancoBase);
                    bancoService.salvar(bancoBase);
                    return Void.TYPE;
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco nao encontrado"));
    }

    @DeleteMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerBanco(@PathVariable("id") Long id){
        bancoService.buscarPorId(id).map(banco -> {
            bancoService.removerPorId(banco.getId());
            return Void.TYPE;
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrada!"));
    }

}
