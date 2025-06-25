import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const CheckoutSuccess = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // To show loading state

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    const payerID = new URLSearchParams(window.location.search).get("PayerID");

    if (!token || !payerID) {
      setLoading(false); // No token or payerID, stop loading
      return;
    }

    // Gửi yêu cầu xác nhận thanh toán
    axios
      .get(
        `http://localhost:8080/api/paypal/capture-order?token=${token}&payerID=${payerID}&userId=${user?.id}`
      )
      .then(() => {
        // Điều hướng đến trang lịch sử đơn hàng sau khi thanh toán thành công
        navigate("/success");
      })
      .catch((err) => {
        console.error("Lỗi thanh toán PayPal:", err);
      })
      .finally(() => {
        setLoading(false); // Đặt lại trạng thái tải sau khi xử lý xong
      });
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-bold">
        Đang xử lý thanh toán PayPal...
      </div>
    );
  }

  return null; // Không hiển thị gì sau khi thanh toán thành công
};

export default CheckoutSuccess;
