package com.example.webbanquanao_be.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;


@Component
public class Restcofig implements RepositoryRestConfigurer {

  @Autowired
  private EntityManager entityManager; // EntityManager giúp làm việc với JPA, cho phép truy vấn dữ liệu từ database.

  /**
   * Cấu hình cho Spring Data REST, cho phép expose ID của các entity trong response.
   * Mặc định, Spring Data REST sẽ ẩn ID của các entity, nên ta cần cấu hình để hiển thị.
   * @param config - Cấu hình của Spring Data REST.
   * @param cors - Đối tượng cấu hình CORS (Chính sách chia sẻ tài nguyên giữa các nguồn khác nhau).
   */
  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
    // Lấy danh sách tất cả các entity trong hệ thống và expose ID của chúng trong API REST.
    config.exposeIdsFor(
            entityManager.getMetamodel().getEntities().stream()  // Lấy tất cả entity từ EntityManager
                    .map(Type::getJavaType)  // Lấy class Java của từng entity
                    .toArray(Class[]::new)  // Chuyển thành mảng Class[]
    );
  }
}
