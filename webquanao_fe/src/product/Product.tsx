import React, { useEffect, useState } from "react";
import ProductModel from "../models/ProductModel";
import { getAllGalery } from "../api/GaleryApi";
import GaleryModel from "../models/GaleryModel";
import { Link } from "react-router-dom";
import dinhDangso from "../component/ultis/Dinhdangso";
import axios from "axios";

interface ProductPropsInterface {
  product: ProductModel;
}

const Product: React.FC<ProductPropsInterface> = ({ product }) => {
  const product_id = product.id;

  const [listGalery, setListGalery] = useState<GaleryModel[]>([]);
  const [downloadingData, setDownloadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllGalery(product_id)
      .then((galeryData) => {
        setListGalery(galeryData);
        setDownloadingData(false);
      })
      .catch((error) => {
        setError(error.message);
        setDownloadingData(false);
      });
  }, [product_id]);

  if (downloadingData) return <h1>Đang Tải Dữ Liệu</h1>;
  if (error) return <h1>Lỗi: {error}</h1>;

  const imageData = listGalery[0]?.imageData || "";

  const handleAddToCart = async () => {
    try {
      const userString = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userString || !token || token === "null" || token === "undefined") {
        alert(" Bạn cần đăng nhập để thêm vào giỏ hàng!");
        return;
      }

      const user = JSON.parse(userString);

      if (!user?.id) {
        alert(" Không tìm thấy ID người dùng.");
        return;
      }

      console.log("📦 Token đang gửi:", token);
      console.log(" Data gửi:", {
        userId: user.id,
        productId: product.id,
        quantity: 1
      });

      const res = await axios.post(
        "http://localhost:8080/api/cart",
        {
          userId: user.id,
          productId: product.id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error: any) {
      console.error(" Lỗi khi thêm vào giỏ hàng:", error);
      if (error.response?.status === 401) {
        alert(" Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        alert(" Không thể thêm vào giỏ hàng.");
      }
    }
  };

  return (
    <li className="w-full mb-6">
      <div className="group block overflow-hidden w-full relative shadow-sm rounded-md">
        <span className="absolute top-5 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10">
          <span className="font-bold">-21%</span>
        </span>

        <span className="absolute top-5 left-0 bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-e-md z-10">
          New Arrival
        </span>

        <Link to={`/product/${product.id}`}>
          <img
            src={imageData}
            alt={product.productName}
            className="h-[530px] w-full object-cover rounded-t-lg transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="bg-white p-4 rounded-b-lg">
          <h3 className="text-xl font-sans group-hover:font-serif transition duration-300 mb-2">
            {product.productName}
          </h3>

          <div className="flex items-center justify-between text-gray-900 mb-2">
            <p className="text-lg font-semibold">{dinhDangso(product.price)}đ</p>
            <span className="text-red-500 text-sm mr-[180px]">
              <del>{dinhDangso(product.listPrice)}đ</del>
            </span>
            <div className="flex space-x-2 ml-3">
              <div className="w-4 h-4 bg-black border border-gray-300"></div>
              <div className="w-4 h-4 bg-white border border-gray-300"></div>
            </div>
          </div>

          <p className="text-xs uppercase tracking-wide text-gray-600 mb-4">
            Số lượng: {product.quantity}
          </p>

          <button
            className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white h-[45px] rounded-lg text-sm font-semibold transition duration-300 shadow-md hover:shadow-lg"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </li>
  );
};

export default Product;
