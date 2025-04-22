import ProductModel from "../models/ProductModel";
import { my_request } from "./Request";

interface resultInterface {
  result: ProductModel[];
  totalPage: number;
  productNumberOnThePage: number;
}

export async function getProduct(endpoint: string): Promise<resultInterface> {
  const result: ProductModel[] = [];

  // Gọi phương thức request
  const response = await my_request(endpoint);

  const responseData = response._embedded.products;

  const totalPage: number = response.page.totalPages;
  const productNumberOnThePage: number = response.page.totalElements;
  for (const key in responseData) {
    // Kiểm tra nếu các thuộc tính cần thiết tồn tại

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

export async function getAllProduct(
  currentPage: number
): Promise<resultInterface> {
  const endpoint: string = `http://localhost:8080/product?sort=id,desc&size=12&page=${currentPage}`;

  return getProduct(endpoint);
}

export async function searchProduct(
  searchKeywords: String,
  id: number
): Promise<resultInterface> {
  let endpoint: string = `http://localhost:8080/product?sort=id,decs&size=12&page=0`;

  if (searchKeywords !== "" && id == 0) {
    endpoint = `http://localhost:8080/product/search/findByProductNameContaining?sort=id,decs&size=12&page=0&productName=${searchKeywords}`;
  } else if (searchKeywords === "" && id > 0) {
    endpoint = `http://localhost:8080/product/search/findByListCategory_id?sort=id,decs&size=12&page=0&id=${id}`;
  } else if (searchKeywords !== "" && id > 0) {
    endpoint = `http://localhost:8080/product/search/findByProductNameContainingAndListCategory_id?sort=id,decs&size=12&page=0&id=${id}&productName=${searchKeywords}`;
  }
  return getProduct(endpoint);
}

export async function getProductDetails(
  id: number
): Promise<ProductModel | null> {
  const endpoint = `http://localhost:8080/product/${id}`;

  try {
    // Gọi phương thức request
    const response = await fetch(endpoint);
    console.log(response);

    if (!response.ok) {
      throw new Error("Gặp lỗi API trong quá trình lấy sản phẩm");
    }

    const productData = await response.json();

    // Kiểm tra xem dữ liệu có tồn tại và đầy đủ không
    if (productData && productData.id && productData.productName) {
      // Trả về đối tượng ProductModel
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
