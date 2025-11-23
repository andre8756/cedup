package com.conta.conta.Controller;

import com.conta.conta.DTO.*;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Service.BancoService;
import com.conta.conta.Service.ContaService;
import com.conta.conta.Service.PdfService;
import com.conta.conta.Service.TransacaoService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/conta")
@PreAuthorize("hasRole('USER')")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @Autowired
    private BancoService bancoService;

    @Autowired
    private TransacaoService transacaoService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private ModelMapper modelMapper;

    // ================================
    // CONTA
    // ================================

    @GetMapping("/atual")
    public Conta buscarContaAtual() {
        return contaService.buscarContaLogada();
    }

    @PutMapping("/atual")
    public ResponseEntity<?> atualizarConta(@Valid @RequestBody ContaUpdateRequest dto) {
        contaService.atualizarContaLogada(dto);
        return ResponseEntity.ok("Dados atualizados com sucesso!");
    }

    @DeleteMapping("/atual")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerConta() {
        contaService.removerContaUsuario();
    }

    // ================================
    // BANCOS
    // ================================

    @GetMapping("/banco")
    public List<BancoResponse> listarBancosDaContaAtual() {
        return bancoService.listarBancoPorContaId();
    }

    @GetMapping("/banco/id/{id}")
    public BancoResponse buscarBanco(@PathVariable Long id) {
        try {
            return bancoService.buscarPorId(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado");
        }
    }

    @GetMapping("/banco/permitir-transacao")
    public List<BancoResponse> listarBancosQuePermitemTransacao() {
        return bancoService.listarBancosPermitemTransacao()
                .stream()
                .map(BancoResponse::fromEntity)
                .toList();
    }

    @GetMapping("/banco/chave-pix/{chavePix}")
    public BancoResponse buscarBancoPorChavePix(@PathVariable String chavePix) {
        try {
            return BancoResponse.fromEntity(bancoService.buscarEntidadePorChavePix(chavePix));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado");
        }
    }

    @PostMapping("/banco")
    @ResponseStatus(HttpStatus.CREATED)
    public BancoResponse salvarBanco(@Valid @RequestBody BancoRequest dto) {
        return bancoService.salvar(dto);
    }

    @PutMapping("/banco/{id}")
    public BancoUpdateResponse atualizarBanco(@PathVariable Long id, @Valid @RequestBody BancoUpdateRequest dto) {
        try {
            return bancoService.atualizar(id, dto);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerBanco(@PathVariable Long id) {
        bancoService.removerPorId(id);
    }

    // ================================
    // TRANSAÇÕES
    // ================================

    @PostMapping("/banco/{origemPix}/{destinoPix}/transacao")
    @ResponseStatus(HttpStatus.CREATED)
    public TransacaoResponseDto salvarTransacao(
            @PathVariable String origemPix,
            @PathVariable String destinoPix,
            @RequestBody Transacao transacao) {
        return transacaoService.processarTransacao(origemPix, destinoPix, transacao);
    }

    @DeleteMapping("/banco/transacao/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerTransacao(@PathVariable Long id) {
        transacaoService.removerPorId(id);
    }

    // ================================
    // FILTROS & PDF
    // ================================

    @GetMapping("/banco/transacao/filtros")
    public List<TransacaoResponseDto> listarComFiltros(TransacaoFiltro filtro) {
        return transacaoService.listarComFiltros(filtro);
    }

    @GetMapping("/banco/transacao/filtros/pdf")
    public ResponseEntity<byte[]> downloadPdfComFiltros(TransacaoFiltro filtro) {
        List<TransacaoResponseDto> transacoesFiltradas = transacaoService.listarComFiltros(filtro);
        byte[] pdfBytes = pdfService.generateTransacoesPdf(transacoesFiltradas);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("relatorio-transacoes-" + System.currentTimeMillis() + ".pdf")
                .build());
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // ================================
    // RESUMOS
    // ================================

    @GetMapping("/banco/transacao/receita")
    public ResponseEntity<?> receitaMensal() {
        try {
            float total = transacaoService.calcularReceitaMensal();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao calcular receita mensal: " + e.getMessage());
        }
    }

    @GetMapping("/banco/transacao/despesa")
    public ResponseEntity<?> despesaMensal() {
        try {
            float total = transacaoService.calcularDespesaMensal();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao calcular despesa mensal: " + e.getMessage());
        }
    }
}
