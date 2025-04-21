package com.example.webbanquanao_be.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;



@Entity
  @Data
  @Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "product_name", length = 256)
    private  String productName;

    @Column(name = "description", columnDefinition = "text")
    private String description;
    @Column(name = "listprice" )
    private BigDecimal listPrice;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "color")
    private String color;

    @Column(name = "size")
    private String size;


    @Column(name = "quantity")
    private int quantity;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinTable(
            name = "product_listcategory",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    List<Category> listCategory;


    @OneToMany(mappedBy = "product",
            fetch = FetchType.LAZY, cascade = CascadeType.ALL
    )
    List<Galery> listGalery;

    @OneToMany(mappedBy = "product",
              fetch = FetchType.LAZY, cascade = CascadeType.ALL
    )
    List<Evaluate> listevaluate;
    @OneToMany(mappedBy = "product",
              fetch = FetchType.LAZY, cascade = {
              CascadeType.MERGE, CascadeType.PERSIST,
              CascadeType.DETACH, CascadeType.REFRESH }
    )
    List<Order_Details> listOrderDetail;


      @OneToMany(mappedBy = "product",
              fetch = FetchType.LAZY, cascade = CascadeType.ALL
      )
    List<Favorite_Products> listFavoriteProduct;

      @OneToMany(mappedBy = "product",
              fetch = FetchType.LAZY, cascade = CascadeType.ALL
      )
    List<Favorite_Products> listFavoriteProducts;




}
