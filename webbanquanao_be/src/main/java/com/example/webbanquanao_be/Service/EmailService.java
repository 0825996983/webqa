package com.example.webbanquanao_be.Service;

import org.springframework.stereotype.Service;

public interface EmailService {


    public void sendMessage (String form, String to, String subject, String text);
}
