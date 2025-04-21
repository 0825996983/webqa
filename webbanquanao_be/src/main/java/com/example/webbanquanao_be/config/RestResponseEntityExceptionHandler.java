package com.example.webbanquanao_be.config;

import com.example.webbanquanao_be.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class RestResponseEntityExceptionHandler {

    @ExceptionHandler(value = { CustomException.class, CustomException.class })
    protected ResponseEntity<Object> handleConflict(
            RuntimeException ex, WebRequest request) {
        String bodyOfResponse = "This should be application specific";
        return new ResponseEntity(bodyOfResponse, HttpStatus.BAD_REQUEST);
    }


}
