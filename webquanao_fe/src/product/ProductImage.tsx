import React, { useEffect, useState } from "react";
import ProductModel from "../models/ProductModel";
import { getAllGalery } from "../api/GaleryApi";
import GaleryModel from "../models/GaleryModel";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";

interface productImage {
  product_id: number;
}

const ProductImage: React.FC<productImage> = (props) => {
  const produc_id: number = props.product_id;


  const [listGalery, setListGalery] = useState<GaleryModel[]>([]);
  const [downloadingData, setdownloadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GaleryModel | null>(null);
  const selectPhoto = (images: GaleryModel) => {
    setSelectedImage(images);
  };

  useEffect(() => {
    getAllGalery(produc_id)
      .then((list) => {
        setListGalery(list);
        if (list.length > 0) {
          setSelectedImage(list[0]);
        }
        setdownloadingData(false);
      })
      .catch((error) => {
        setError(error.message);
        setdownloadingData(false);
      });
  }, [produc_id]);

  if (downloadingData) {
    return (
      <div>
        <h1>Đang Tải Dữ Liệu</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Lỗi:{error}</h1>
      </div>
    );
  }
  let imageData: string = "";
  if (listGalery[0] && listGalery[0].imageData) {
    imageData = listGalery[0].imageData;
  }

  return (
    <div className="w-full lg:sticky top-0 flex gap-3 max-h-fit ">
      
        {selectedImage && (
          <div className="w-3/4 rounded-lg object-cover">
          <img
            src={selectedImage.imageData}
            alt="Product"
            
          />
          </div>
        )}
      

      <Carousel  className="top-[-100px]">
        {listGalery.map((images, index) => (
          <div className="w-32 flex flex-col max-sm:mb-4 gap-3 pb-[10px]">
             <div key={index} onClick={() => selectPhoto(images)}>
              {images && (
                <img
                  src={images.imageData}
                  alt={`${images.imageName}`}
                  className=""
                />
              )}
              </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductImage;
