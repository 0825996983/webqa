package com.example.webbanquanao_be.Service;
import com.example.webbanquanao_be.entity.Galery;
import com.example.webbanquanao_be.repository.GaleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GalerySevice {
    @Autowired
    private GaleryRepository galeryRepository;

    // Lấy danh sách ảnh theo `product_id`
    public List<ImageResponse> getImagesByProductId(Long productId) {
        List<Galery> images = galeryRepository.findByProductId(productId);

        return images.stream()
                .map(image -> new ImageResponse(
                        image.getId(),
                        image.getImageName(),
                        image.getLink(),
                        image.getMainImage(),
                        image.getImageData()
                ))
                .collect(Collectors.toList());
    }

    public static class ImageResponse {
        private Integer id;
        private String imageName;
        private String link;
        private Boolean mainImage;
        private String imageData;

        public ImageResponse(Integer id, String imageName, String link, Boolean mainImage, String imageData) {
            this.id = id;
            this.imageName = imageName;
            this.link = link;
            this.mainImage = mainImage;
            this.imageData = imageData;
        }

        public Integer getId() { return id; }
        public String getImageName() { return imageName; }
        public String getLink() { return link; }
        public Boolean getMainImage() { return mainImage; }
        public String getImageData() { return imageData; }
    }

}
