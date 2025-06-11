package com.example.webbanquanao_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "galery")
public class Galery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "imagename", length = 256)
    private String imageName;

    @Column(name = "mainimage")
    private Boolean mainImage;

    @Column(name = "link")
    private String link;

    @Column(name = "imagedata", columnDefinition = "LONGTEXT")
    @Lob
    private String imageData;

    @JsonIgnore  
    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
