import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Success = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  return (
    <div className="flex justify-center bg-gray-100 py-10 pt-36 pb-36">
      <div className="w-3/4 bg-white shadow-lg rounded-lg p-8 ">
      <h1 className="text-green-600 text-xl">THANH TOÁN THÀNH CÔNG</h1>
        <div className="grid grid-cols-3 gap-8 mb-8 ">
          {/* Cột 1: Thông tin mua hàng và địa chỉ nhận hàng */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Thông tin mua hàng</h3>
              <p className="text-sm">2234</p>
              <p className="text-sm">quangbien203@gmail.com</p>
              <p className="text-sm">+84838367836</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Địa chỉ nhận hàng</h3>
              <p className="text-sm">2234</p>
              <p className="text-sm">Phương Ngọc Quyền, Thị xã Sơn Tây, Hà Nội</p>
              <p className="text-sm">+84838367836</p>
            </div>
          </div>

          {/* Cột 2: Phương thức vận chuyển */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Phương thức vận chuyển</h3>
            <p className="text-sm">Freelship đơn hàng từ 300k</p>
          </div>

          {/* Cột 3: Thông tin đơn hàng */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-2">Đơn hàng #24669</h3>
            <div className="flex justify-between mb-4">
              <p className="text-sm">ClownZ Social Ringer Tee</p>
              <p className="text-sm">300.000đ</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm">Tạm tính</p>
              <p className="text-sm">300.000đ</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm">Phí vận chuyển</p>
              <p className="text-sm">Miễn phí</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Tổng cộng</p>
              <p className="text-sm font-semibold">300.000đ</p>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="mr-2"
            />
            <span className="text-sm">Thanh toán khi giao hàng (COD)</span>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={() => setPaymentMethod("PayPal")}
              className="mr-2"
            />
            <span className="text-sm">Thanh toán qua PayPal</span>
          </div>
        </div>

        <div className="flex justify-center">
            <NavLink to="/product">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md">Tiếp tục mua hàng</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Success;
