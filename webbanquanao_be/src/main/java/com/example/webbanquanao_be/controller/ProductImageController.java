package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Service.GalerySevice;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/product")
@CrossOrigin(origins = "*")
@Tag(name = "Product Gallery", description = "Xử lý hình ảnh sản phẩm")
public class ProductImageController {

    @Autowired
    private GalerySevice galeryService;

    @GetMapping("/{product_id}/listGalery")
    @Operation(summary = "Lấy danh sách hình ảnh của sản phẩm theo ID")
    public ResponseEntity<List<GalerySevice.ImageResponse>> getImagesByProductId(@PathVariable("product_id") Long productId) {
        List<GalerySevice.ImageResponse> imageResponses = galeryService.getImagesByProductId(productId);

        if (imageResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(imageResponses);
    }
}
