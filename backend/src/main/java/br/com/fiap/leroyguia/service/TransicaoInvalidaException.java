package br.com.fiap.leroyguia.service;

public class TransicaoInvalidaException extends RuntimeException {
    public TransicaoInvalidaException(String mensagem) {
        super(mensagem);
    }
}
