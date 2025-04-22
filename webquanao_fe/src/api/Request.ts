export const BASE_LOCAL_API = 'http://localhost:8080';

export async function my_request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    // Nếu có token thì thêm vào header Authorization
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Hợp nhất options với headers mặc định
    const finalOptions: RequestInit = {
        method: options.method || "GET",
        headers: { ...headers, ...options.headers }, // Gộp headers
        body: options.body, // Giữ nguyên body nếu có
    };

    // Gọi API
    const response = await fetch(endpoint, finalOptions);

    if (!response.ok) {
        throw new Error(`Lỗi khi truy cập API: ${endpoint}`);
    }

    return response.json();
}
