package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.entity.Notification;
import com.example.webbanquanao_be.entity.User;
import com.example.webbanquanao_be.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService {
    private BCryptPasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private EmailService emailService;


    public ResponseEntity<?> userRegistration(User user) {


        // Kiểm tra xem tên đăng nhập đã tồn tại hay chưa
        if (userRepository.existsByUserName(user.getUserName())) {
            return ResponseEntity.badRequest().body(new Notification("Tên đăng nhập đã tồn tại."));
        }

        // Kiểm tra xem email đã tồn tại hay chưa
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(new Notification("Email đã tồn tại."));
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        String encryptPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptPassword);

        // Tạo mã kích hoạt tài khoản và đánh dấu là chưa kích hoạt
        user.setActivationCode(generateActivationCode());
        user.setActivated(false);

        // Gửi email kích hoạt tài khoản
        sendActivationEmail(user.getEmail(), user.getActivationCode());

        // Lưu thông tin người dùng vào cơ sở dữ liệu
        User nguoidungdadangki = userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công");
    }

    private String generateActivationCode() {
        return UUID.randomUUID().toString(); // Tạo mã ngẫu nhiên dạng UUID
    }

    /**
     * Gửi email kích hoạt tài khoản
     *  email - Email của người dùng
     * activationCode - Mã kích hoạt tài khoản
     */
    private void sendActivationEmail(String email, String activationCode) {
        // Tiêu đề email
        String subject = "Kích hoạt tài khoản của bạn tại webbanquanao";

        // Nội dung email chứa mã kích hoạt và đường dẫn kích hoạt
        String text = "Vui lòng sử dụng mã sau để kích hoạt tài khoản <" + email + ">:";
        text += "<html><body><br/><h1>" + activationCode + "</h1></body></html>";
        text += "<br/> Click vào link để kích hoạt tài khoản:";

        // Địa chỉ URL để người dùng kích hoạt tài khoản
        String url = "http://localhost:3000/activate/" + email + "/" + activationCode;
        text += "<br/> <a href='" + url + "'>" + url + "</a>";

        // Gửi email bằng EmailService
        emailService.sendMessage("doquangbien3172003@gmail.com", email, subject, text);
    }

    /**
     * Kích hoạt tài khoản khi người dùng nhập mã kích hoạt đúng
       email - Email của người dùng
       activationCode - Mã kích hoạt tài khoản
       ResponseEntity chứa kết quả kích hoạt
     */
    public ResponseEntity<?> activateAccount(String email, String activationCode) {
        // Tìm kiếm người dùng theo email
        User user = userRepository.findByEmail(email);

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (user == null) {
            return ResponseEntity.badRequest().body(new Notification("User does not exist!"));
        }

        // Nếu tài khoản đã kích hoạt rồi thì không cần kích hoạt nữa
        if (user.isActivated()) {
            return ResponseEntity.badRequest().body(new Notification("Account has been activated"));
        }

        // Kiểm tra mã kích hoạt có đúng không
        if (activationCode.equals(user.getActivationCode())) {
            // Nếu đúng, kích hoạt tài khoản và lưu vào cơ sở dữ liệu
            user.setActivated(true);
            userRepository.save(user);
            return ResponseEntity.ok("Account activation successful!");
        } else {
            // Nếu sai, trả về v
            return ResponseEntity.badRequest().body(new Notification("Incorrect activation code!"));
        }
    }
}
