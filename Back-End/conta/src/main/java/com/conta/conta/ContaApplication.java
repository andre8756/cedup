package com.conta.conta;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;

import java.time.format.DateTimeFormatter;

@SpringBootApplication
public class ContaApplication {

	// Configuração do modelMapper
	@Bean
	public ModelMapper modelMapper(){
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration().setSkipNullEnabled(true);
		return modelMapper;
	}

	// Configuração do campo dataCadastro para o modelMapper
	@Bean
	public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
		return builder -> {
			builder.serializers(new LocalDateTimeSerializer(
					DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm")
			));
			builder.serializationInclusion(JsonInclude.Include.NON_NULL);
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(ContaApplication.class, args);
	}

}
