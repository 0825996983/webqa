package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.exception.CustomException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmailServiceImpl implements EmailService {

    private JavaMailSender emailSender; // Đối tượng dùng để gửi email

//     Phương thức gửi email
    @Override
    public void sendMessage(String from, String to, String subject, String text) {
        // Tạo một email dưới dạng MIME (có thể chứa nội dung HTML hoặc file đính kèm)
        MimeMessage message = emailSender.createMimeMessage();
        try {
            // Dùng MimeMessageHelper để thiết lập thông tin email
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from); // Đặt địa chỉ người gửi
            helper.setTo(to); // Đặt địa chỉ người nhận
            helper.setSubject(subject); // Đặt tiêu đề email
            helper.setText(text, true); // Đặt nội dung email, tham số thứ hai là "true" để cho phép HTML

        } catch (MessagingException e) {
            // Nếu có lỗi trong quá trình tạo email, ném lỗi RuntimeException
            throw new CustomException("Lỗi khi gửi email: " + e.getMessage(), e);
        }

        // Thực hiện gửi email
        emailSender.send(message);
    }
}
