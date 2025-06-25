import ProductModel from "../models/ProductModel";
import { my_request } from "./Request";

interface resultInterface {
  result: ProductModel[];
  totalPage: number;
  productNumberOnThePage: number;
}

async function authorizedRequest(endpoint: string): Promise<any> {
  const token = localStorage.getItem("token");

  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("API request failed with status: " + response.status);
  }

  return await response.json();
}

export async function getProduct(endpoint: string): Promise<resultInterface> {
  const result: ProductModel[] = [];

  const response = await authorizedRequest(endpoint);
  const responseData = response._embedded?.products || [];
  const totalPage: number = response.page?.totalPages || 0;
  const productNumberOnThePage: number = response.page?.totalElements || 0;

  for (const key in responseData) {
    result.push({
      id: responseData[key].id,
      productName: responseData[key].productName,
      description: responseData[key].description,
      listPrice: responseData[key].listPrice,
      price: responseData[key].price,
      quantity: responseData[key].quantity,
    });
  }

  return {
    result: result,
    totalPage: totalPage,
    productNumberOnThePage: productNumberOnThePage,
  };
}

export async function getAllProduct(currentPage: number): Promise<resultInterface> {
  const safePage = Math.max(currentPage, 0); // 🔒 chống page âm
  const endpoint: string = `http://localhost:8080/product?sort=id,desc&size=12&page=${safePage}`;
  return getProduct(endpoint);
}

export async function searchProduct(searchKeywords: string, id: number): Promise<resultInterface> {
  let endpoint: string = `http://localhost:8080/product?sort=id,desc&size=12&page=0`;

  if (searchKeywords !== "" && id === 0) {
    endpoint = `http://localhost:8080/product/search/findByProductNameContaining?sort=id,desc&size=12&page=0&productName=${encodeURIComponent(searchKeywords)}`;
  } else if (searchKeywords === "" && id > 0) {
    endpoint = `http://localhost:8080/product/search/findByListCategory_id?sort=id,desc&size=12&page=0&id=${id}`;
  } else if (searchKeywords !== "" && id > 0) {
    endpoint = `http://localhost:8080/product/search/findByProductNameContainingAndListCategory_id?sort=id,desc&size=12&page=0&id=${id}&productName=${encodeURIComponent(searchKeywords)}`;
  }

  return getProduct(endpoint);
}

export async function getProductDetails(id: number): Promise<ProductModel | null> {
  const endpoint = `http://localhost:8080/product/${id}`;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Gặp lỗi API trong quá trình lấy sản phẩm");
    }

    const productData = await response.json();

    if (productData && productData.id && productData.productName) {
      return {
        id: productData.id,
        productName: productData.productName,
        description: productData.description,
        listPrice: productData.listPrice,
        price: productData.price,
        quantity: productData.quantity,
      };
    } else {
      throw new Error("Sản phẩm không tồn tại hoặc thiếu thông tin");
    }
  } catch (error) {
    console.error("Error: " + error);
    return null;
  }
}
