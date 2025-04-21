package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.service.GaleryService;
import com.example.webbanquanao_be.service.GaleryService.ImageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "*") // Cho phép React truy cập API
public class ProductImageController {

    @Autowired
    private GaleryService galeryService;

    @GetMapping("/{product_id}/listGalery")
    public ResponseEntity<List<ImageResponse>> getImagesByProductId(@PathVariable("product_id") Long productId) {
        List<ImageResponse> imageResponses = galeryService.getImagesByProductId(productId);

        if (imageResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(imageResponses);
    }
}
