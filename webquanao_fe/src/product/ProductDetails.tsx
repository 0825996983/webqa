import React, { useEffect, useState } from "react";
import ProductModel from "../models/ProductModel";
import { Link, useParams } from "react-router-dom";
import { getProductDetails } from "../api/ProductApi";
import ProductImage from "./ProductImage";
import dinhDangso from "../component/ultis/Dinhdangso";

const ProductDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState("details");

  const { id } = useParams();

  let idProductNumber = 0;
  try {
    idProductNumber = parseInt(id + "");
    if (Number.isNaN(idProductNumber)) idProductNumber = 0;
  } catch (error) {
    idProductNumber = 0;
    console.error("Error :" + error);
  }

  //khai bao
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [downloadingData, setdownloadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductDetails(idProductNumber)
      .then((product) => {
        setProduct(product);
        setdownloadingData(false);
      })
      .catch((error) => {
        setError(error.message);
        setdownloadingData(false);
      });
  }, [id]);
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
  if (!product) {
    return (
      <div className="container p-48 ">
        <div className="bg-whit h-screen">
          <div className="flex items-center justify-center py-12">
            <div className="bg-white border rounded-md flex items-center justify-center mx-4 md:w-2/3 ">
              <div className="flex flex-col items-center py-16 ">
                <img
                  className="px-4 hidden md:block"
                  src="https://i.ibb.co/9Vs73RF/undraw-page-not-found-su7k-1-3.png"
                  alt=""
                />
                <img
                  className="md:hidden"
                  src="https://i.ibb.co/RgYQvV7/undraw-page-not-found-su7k-1.png"
                  alt=""
                />
                <h1 className="px-4 pt-8 pb-4 text-center text-5xl font-bold leading-10 text-gray-800">
                  OOPS!{" "}
                </h1>
                <p className="px-4 pb-10 text-base leading-none text-center text-gray-600">
                  No signal here! we cannot find the page you are looking for{" "}
                </p>
                <a href="/">
                  <button className="mx-4 h-10 w-44 border rounded-md text-white text-base bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-indigo-800">
                    Go Back
                  </button>{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-10 mt-32">
      <div className="m-10 mt-32">
        <div className="font-sans">
          <div className="p-7 max-w-full max-md:max-w-xl mx-auto">
            <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-4">
              <ProductImage product_id={idProductNumber} />

              <div className="max-w-3xl">
                <h2 className="text-2xl max-sm:text-2xl font-bold text-gray-800">
                  Adjective Attire | T-shirt
                </h2>
                <div className="mt-2">
                  <h4 className="text-gray-800 text-4xl max-sm:text-3xl font-bold">
                    {dinhDangso(product.price)}đ
                  </h4>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-800">Sizes</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      className="w-10 h-10 border-2 hover:border-gray-800 font-semibold text-xs text-gray-800 rounded-lg flex items-center justify-center shrink-0"
                    >
                      M
                    </button>
                    <button
                      type="button"
                      className="w-10 h-10 border-2 hover:border-gray-800 border-gray-800 font-semibold text-xs text-gray-800 rounded-lg flex items-center justify-center shrink-0"
                    >
                      L
                    </button>
                    <button
                      type="button"
                      className="w-10 h-10 border-2 hover:border-gray-800 font-semibold text-xs text-gray-800 rounded-lg flex items-center justify-center shrink-0"
                    >
                      XL
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-800">Colors</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      className="w-10 h-10 bg-black border-2 border-white hover:border-gray-800 rounded-lg shrink-0"
                    ></button>
                    <button
                      type="button"
                      className="w-10 h-10 bg-gray-400 border-2 border-white hover:border-gray-800 rounded-lg shrink-0"
                    ></button>
                    <button
                      type="button"
                      className="w-10 h-10 bg-orange-400 border-2 border-white hover:border-gray-800 rounded-lg shrink-0"
                    ></button>
                    <button
                      type="button"
                      className="w-10 h-10 bg-red-400 border-2 border-white hover:border-gray-800 rounded-lg shrink-0"
                    ></button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white border border-gray-800 text-base rounded-lg"
                  >
                    {" "}
                    {/* Increased padding for larger button */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 cursor-pointer fill-current inline mr-2"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                        data-original="#000000"
                      ></path>
                    </svg>
                    Add to cart
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center px-8 py-3 bg-transparent hover:bg-gray-50 text-gray-800 border border-gray-800 text-base rounded-lg"
                  >
                    {" "}
                    {/* Increased padding for larger button */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 cursor-pointer fill-current inline mr-2"
                      viewBox="0 0 64 64"
                    >
                      <path
                        d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                        data-original="#000000"
                      ></path>
                    </svg>
                    Add to wishlist
                  </button>
                </div>

                {/* Tab section */}
                <ul className="grid grid-cols-2 mt-6">
                  <li
                    onClick={() => setActiveTab("details")}
                    className={`text-gray-800 font-semibold text-base text-center py-2 px-3 border-b-2 cursor-pointer ${
                      activeTab === "details"
                        ? "border-gray-800 bg-gray-50"
                        : ""
                    }`}
                  >
                    Details
                  </li>
                  <li
                    onClick={() => setActiveTab("description")}
                    className={`text-gray-800 font-semibold text-base text-center py-2 px-3 border-b-2 cursor-pointer ${
                      activeTab === "description"
                        ? "border-gray-800 bg-gray-50"
                        : ""
                    }`}
                  >
                    Description
                  </li>
                </ul>

                {/* Nội dung hiển thị theo tab */}
                {activeTab === "details" ? (
                  <div className="mt-6">
                    <img
                      src="https://bizweb.dktcdn.net/100/414/728/files/clownz-suede-block-shirt-1.jpg?v=1694687524995"
                      alt=""
                      className="w-[600px] h-auto rounded-lg"
                    />{" "}
                    {/* Set fixed width for the image */}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 mt-6 h-80">
                    {" "}
                    {/* Reduced height for description */}
                    <p>
                      This T-shirt is made from soft cotton fabric, making it
                      comfortable to wear all day long.
                    </p>
                    <p className="mt-2">
                      Washing instructions: Machine wash cold, tumble dry low.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div> helo</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
