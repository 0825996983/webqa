import GaleryModel from "../models/GaleryModel";
import { my_request } from "./Request";

export async function getAllGalery(product_id: number): Promise<GaleryModel[]> {
    const endpoint = `http://localhost:8080/product/${product_id}/listGalery`;

    try {
        // Gọi API với JWT
        const response = await my_request(endpoint, {
            method: "GET", // GET mặc định, có thể bỏ
        });

        // Kiểm tra dữ liệu trả về có hợp lệ không
        if (!response || !Array.isArray(response)) {
            console.error("Invalid API response:", response);
            return [];
        }

        // Chuyển đổi dữ liệu thành danh sách GaleryModel
        return response.map((item: any) => ({
            id: item.id ?? 0, // Tránh undefined
            imageName: item.imageName ?? "Unknown", // Tránh lỗi nếu thiếu dữ liệu
            mainImage: !!item.mainImage, // Ép kiểu boolean
            link: item.link ?? "", // URL ảnh
            imageData: item.imageData ?? null, // Base64
        }));
    } catch (error) {
        console.error("Error fetching gallery:", error);
        return [];
    }
}
