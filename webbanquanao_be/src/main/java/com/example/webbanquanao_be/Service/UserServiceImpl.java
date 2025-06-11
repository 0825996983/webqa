package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.entity.Role;
import com.example.webbanquanao_be.entity.User;
import com.example.webbanquanao_be.repository.RoleRepository;
import com.example.webbanquanao_be.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository; // Repository để thao tác với bảng User
    private RoleRepository roleRepository; // Repository để thao tác với bảng Role

    @Override
    public User findByUserName(String userName) {
        return userRepository.findByUserName(userName);
    }


//     * Tải thông tin người dùng dựa trên tên đăng nhập
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm kiếm người dùng trong database
        User user = userRepository.findByUserName(username);

        // Nếu không tìm thấy, ném ra ngoại lệ UsernameNotFoundException
        if (user == null) {
            throw new UsernameNotFoundException("Tài khoản không tồn tại");
        }

        // Trả về đối tượng UserDetails chứa thông tin đăng nhập của người dùng
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(), // Tên đăng nhập
                user.getPassword(), // Mật khẩu đã được mã hóa
                rolesToAuthorities(user.getListRole()) // Danh sách quyền của người dùng
        );
    }


    private Collection<? extends GrantedAuthority> rolesToAuthorities(Collection<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName())) // Chuyển đổi Role thành SimpleGrantedAuthority
                .collect(Collectors.toList()); // Thu thập thành danh sách
    }
}
