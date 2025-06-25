import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface OrderItem {
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface OrderHistory {
  orderId: number;
  totalPayment: number;
  orderItems: OrderItem[];
  status: string;
}

const PaymentHistoryUser: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<OrderHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth(); // Giả sử useAuth hook trả về token và user

  // Kiểm tra và gọi API
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user?.id) {
        setError("User ID is not available");
        setLoading(false);
        return;
      }

      try {
        // Gọi API với user.id
        const response = await fetch(
          `http://localhost:8080/api/orders/history/${user.id}`,
          {
            method: "GET", // Đảm bảo phương thức là GET (hoặc tùy vào API của bạn)
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Xử lý lỗi trả về từ API
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order history");
        }

        const data = await response.json();
        setOrderHistory(data); // Gán dữ liệu nhận được từ API
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message); // Ghi nhận lỗi từ API
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false); // Đảm bảo rằng quá trình loading kết thúc
      }
    };

    fetchOrderHistory();
  }, [user, token]); // Gọi lại API khi user hoặc token thay đổi

  // Hàm định dạng giá trị tiền tệ
  const formatCurrency = (value: number | null) => {
    return value ? value.toLocaleString() : "0"; // Kiểm tra giá trị null trước khi gọi toLocaleString
  };

  // Kiểm tra trạng thái khi dữ liệu đang được tải
  if (loading) {
    return <div>Loading...</div>;
  }

  // Kiểm tra lỗi
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Nếu không có dữ liệu order history
  if (!orderHistory) {
    return <div>No order history available.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Product Section */}
      <div className="space-y-6">
        {/* Product Card */}
        <div className="flex flex-wrap bg-white p-4 rounded-lg shadow-md">
          {/* Order Items */}
          {orderHistory.orderItems.map((item, index) => (
            <div key={index} className="flex flex-wrap mb-6">
              {/* Product Image */}
              <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>

              {/* Product Info */}
              <div className="w-full sm:w-2/3 pl-0 sm:pl-6">
                {/* Product Title */}
                <h1 className="text-xl font-semibold mb-2">{item.productName}</h1>

                {/* Quantity */}
                <p className="text-gray-700 text-sm mb-4">x{item.quantity}</p>

                {/* Price */}
                <div className="text-lg font-semibold text-red-500 mb-4">
                  ₫{formatCurrency(item.price)}
                </div>
              </div>
            </div>
          ))}

          {/* Total Payment */}
          <div className="flex flex-wrap bg-white p-4 rounded-lg shadow-md mt-6">
            <div className="w-full sm:w-2/3 pl-0 sm:pl-6">
              <h2 className="text-xl font-semibold mb-2">Total Payment</h2>
              <div className="text-lg font-semibold text-red-500">
                ₫{formatCurrency(orderHistory.totalPayment)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryUser;
