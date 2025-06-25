package com.example.webbanquanao_be.Security;

public class Endpoints {

    public static final String front_end_host ="http://localhost:3000";





    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "orders/user",
            "/product/**",
            "api/cart/**"


    };
    public static final String[] PUBLIC_GET_ENDPOINTS_AT = {
            "/api/orders/**",
            "api/paypal/**",
            "/user/search/existsByUserName",
            "user/search/existsByEmail",
            "/account/activate"


    };
    public static final String[] PUBLIC_POST_ENDPOINTS = {


            "/api/paypal/capture-order/**",
            "/account/register",
            "/account/login",
            "/api/**"




    };
    public static final String[] ADMIN_GET_ENDPOINTS = {

            "/product",
            "/product/**",
            "/user",
            "/user/**",
            "/galery",
            "/galery/**",
            "/user/search/existsByUserName",
            "user/search/existsByEmail"

    };
    public static final String[] ADMIN_POST_ENDPOINTS = {
            "/product"


    };
}
