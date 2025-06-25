import React, { useEffect, useState } from 'react';

// Định nghĩa kiểu dữ liệu của đơn hàng để TypeScript hiểu
interface Order {
  orderId: number;
  userName: string;
  fullName: string;
  email: string;
  receiverPhone: string;
  shippingAddress: string; // Địa chỉ giao hàng
  status: string;           // Trạng thái thanh toán
  totalPayment: number;     // Tổng thanh toán
  dateCreated: string;      // Ngày tạo
}

const OrderCard = ({
  id,
  name,
  totalPayment,
  paymentStatus,
  dateCreated,
  shippingAddress,
}: {
  id: number;
  name: string;
  totalPayment: number;
  paymentStatus: string;
  dateCreated: string;
  shippingAddress: string;
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-transform transform">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold text-gray-800">Đơn hàng #{id} </div>
       
        <div
        
          className={`px-4 py-2 rounded-md text-white font-semibold ${
            paymentStatus === 'FINISHED'
              ? 'bg-green-500'
              : paymentStatus === 'PENDING'
              ? 'bg-red-500'
              : 'bg-red-500'
          }`}
        >
          {paymentStatus === 'FINISHED'
            ? 'Đã thanh toán'
            : paymentStatus === 'PENDING'
            ? 'Chưa thanh toán'
            : 'Thanh toán thất bại'}
        </div>
      </div>

      <div className="text-sm text-gray-600">
      <div ><strong>Họ Tên:</strong> {name}  </div>
      <p><strong>Địa chỉ giao hàng:</strong> {shippingAddress || 'Chưa cập nhật'}</p>
        <p><strong>Ngày tạo:</strong> {new Date(dateCreated).toLocaleDateString()}</p>
      
      </div>

      <div className="mt-4 text-xl font-bold text-gray-900">
        Tổng thanh toán: {totalPayment.toLocaleString()} VND
      </div>
    </div>
  );
};

const PaymentHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);  // Dữ liệu đơn hàng
  const [loading, setLoading] = useState<boolean>(true);  // Trạng thái đang tải

  // Hàm fetch dữ liệu từ API
  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payment-history/paid'); 
      const data = await response.json();
      setOrders(data);  // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching payment history', error);
    } finally {
      setLoading(false);  // Khi lấy xong, thay đổi trạng thái loading
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchPaymentHistory();
  }, []);  // Chạy 1 lần khi component được mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Lịch sử thanh toán</h1>
      {orders.length === 0 ? (
        <div className="text-center text-lg text-gray-600">Không có đơn hàng nào</div>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.orderId}
            id={order.orderId}
            name={order.fullName}
            totalPayment={order.totalPayment}
            paymentStatus={order.status}  // Trạng thái thanh toán
            dateCreated={order.dateCreated} // Ngày tạo đơn hàng
            shippingAddress={order.shippingAddress} // Địa chỉ giao hàng
          />
        ))
      )}
    </div>
  );
};

export default PaymentHistory;
