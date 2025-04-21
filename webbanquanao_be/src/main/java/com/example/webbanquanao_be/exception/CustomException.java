package com.example.webbanquanao_be.exception;

public class CustomException extends RuntimeException{
    public CustomException() {
        super();
    }


    public CustomException(String message, Throwable cause) {
        super(message, cause);
    }
}
