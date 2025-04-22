import { useEffect, useState } from "react";
import ProductModel from "../models/ProductModel";
import { getAllProduct, searchProduct } from "../api/ProductApi";

export const useProduct = () => {
  const [listProduct, setListProduct] = useState<ProductModel[]>([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPage, settotalPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllProduct = async (currentPage: number) => {
    setIsLoading(true);
    return await getAllProduct(currentPage - 1)
      .then((data) => {
        setListProduct(data.result);
        settotalPage(data.totalPage);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setIsLoading(false));
  };
    const fetchSearchProduct = async (searchKeyWords: string, id : number)=>{
      return await searchProduct(searchKeyWords, id)
      .then((data)=>{
        setListProduct(data.result);
        settotalPage(data.totalPage);

      })
      .catch((e)=>{
        setError(e.message);
      })
      .finally(()=>setIsLoading(false))
    }


  return {
    fetchSearchProduct,
    setcurrentPage,
    fetchAllProduct,
    totalPage,
    currentPage,
    listProduct,
    error,
    isLoading,
  };
};

// useEffect(() => {
//   if (searchKeyWords === '' && id==0) {
//     getAllProduct(currentPage - 1)
//       .then((kq) => {
//         console.log("Dữ liệu sản phẩm:", kq.result); // Dữ liệu từ API

//         setListProduct(kq.result);
//         settotalPage(kq.totalPage);
//         setdownloadingData(false);
//       })
//       .catch((error) => {
//         setError(error.message);
//         setdownloadingData(false);
//       });
//   } else {
//     searchProduct(searchKeyWords, id)
//     .then((kq) => {
//       console.log("Dữ liệu sản phẩm:", kq.result); // Dữ liệu từ API

//       setListProduct(kq.result);
//       settotalPage(kq.totalPage);
//       setdownloadingData(false);
//     })
//     .catch((error) => {
//       setError(error.message);
//       setdownloadingData(false);
//     });
//   }
// }, [currentPage, searchKeyWords, id]);
