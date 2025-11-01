package com.conta.conta.Service;

import com.conta.conta.DTO.TransacaoRequestDto;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import java.util.List;
import java.io.ByteArrayOutputStream;


@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateTransacoesPdf(List<TransacaoRequestDto> transacoes) {
        try {
            // Prepara os dados para o template
            Context context = new Context();
            context.setVariable("transacoes", transacoes);

            // Processa o template Thymeleaf
            String htmlContent = templateEngine.process("relatorio-transacoes", context);

            // Converte HTML para PDF
            ByteArrayOutputStream target = new ByteArrayOutputStream();
            ConverterProperties converterProperties = new ConverterProperties();

            HtmlConverter.convertToPdf(htmlContent, target, converterProperties);

            return target.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }

}
