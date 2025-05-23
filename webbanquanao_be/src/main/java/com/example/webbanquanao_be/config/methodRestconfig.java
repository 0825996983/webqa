package com.example.webbanquanao_be.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class methodRestconfig implements RepositoryRestConfigurer {


    private String url = "http://localhost:3000";
    @Autowired
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {


        //cho phep tra ve id
        config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new));

        //CORS configuration
//        cors.addMapping("/**")
//                .allowedOrigins(url)
//                .allowedMethods("GET","POST", "PUT", "DELETE");


//        HttpMethod[]  chancacphuongthuc= {
//                HttpMethod.POST,
//                HttpMethod.PUT,
//                HttpMethod.PATCH,
//                HttpMethod.DELETE
//        };
//        config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new));
//
//    }
//
//    private void disableHttpMethods(Class c,RepositoryRestConfiguration config, HttpMethod[] methods){
//        config.getExposureConfiguration().forDomainType(c).withItemExposure((metdata, httpMethods) -> httpMethods.disable(methods)).withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(methods));




    }
}
