import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import dinhDangso from "../ultis/Dinhdangso";

type CartItemType = {
  id: number;
  productName?: string;
  price: number;
  listPrice: number;
  description: string;
  quantity: number;
  size: string;
  color: string;
  imageData: string;
};

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { token, user } = useAuth();
  const [cartQty, setCartQty] = useState(0);

  useEffect(() => {
    if (user && token) {
      axios
        .get(`http://localhost:8080/api/cart/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCartItems(response.data);
          const qty = response.data.reduce(
            (total: number, item: CartItemType) => total + item.quantity,
            0
          );
          setCartQty(qty);
          const price = response.data.reduce(
            (total: number, item: CartItemType) =>
              total + item.price * item.quantity,
            0
          );
          setTotalPrice(price);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }
  }, [token, user]);

  const buildPayload = () => ({
    userId: user?.id,
    fullName,
    email,
    phoneNumber: phone,
    shippingAddress: address,
    cartItems: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: totalPrice,
  });

  const handleCheckout = async () => {
    if (!user || !token) {
      alert("Bạn cần đăng nhập để đặt hàng.");
      return;
    }

    const payload = {
      ...buildPayload(),
      paymentMethodId: 1, // COD method
      deliveryMethodId: 1, // default delivery method
    };

    try {
      const response = await axios.post (
        "http://localhost:8080/api/checkout",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        } 
      );
      alert("Đặt hàng (COD) thành công!");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại!");
    }
  };

  const handlePayPalCheckout = async () => {
    if (!user || !token) {
      alert("Bạn cần đăng nhập để thanh toán.");
      return;
    }

    const payload = buildPayload();
    console.log(payload); // Kiểm tra payload trước khi gửi

    try {
      const response = await axios.post(
        "http://localhost:8080/api/paypal/create-order",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { approvalUrl } = response.data;
      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        alert("Không thể tạo đơn PayPal.");
      }
    } catch (error) {
      console.error("Lỗi tạo PayPal order:", error);
      alert("Lỗi PayPal!");
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "COD") {
      handleCheckout();
    } else {
      handlePayPalCheckout();
    }
  };

  return (
    <div className="checkout-page mt-[-34px] ml-52">
      <div className="container mx-auto py-8 w-[1490px]">
        <div className="flex justify-between">
          <div className="checkout-left w-1/3 pr-8 pt-10">
            <h2 className="text-xl font-semibold mb-4">Thông tin nhận hàng</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
            </form>
          </div>

          <div className="checkout-middle w-1/3 pr-8 pt-10">
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
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




          <div
            className=" w-[500px] pl-8 border-l pt-10 h-[650px] mr-40  "
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>
            <div>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div className="flex items-center mb-4" key={item.id}>
                    <img
                      src={item.imageData}
                      alt="product"
                      className="size-20 rounded object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-base text-gray-900">{item.productName}</h3>
                      <p className="text-red-600">{dinhDangso(item.price)} đ</p>
                      <p className="font-medium">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-black h-5">Không có sản phẩm nào trong giỏ hàng</div>
              )}
            </div>
            <div className="order-summary">
              <div className="border-t-[1px] border-dashed border-gray-400"></div>
              <div className="flex justify-between text-sm font-medium text-gray-600 mr-4">
                <span className="text-xl pt-6">Tổng tiền:</span>
                <span className="text-sm font-medium text-gray-900 pt-6">
                  <span className="text-xl font-medium ml-1 text-red-600 mb-20 ">
                    {dinhDangso(totalPrice)}
                  </span>
                  <span className="text-sm font-medium text-red-600 mb-20" style={{ fontSize: "0.8rem" }}>
                    đ
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className=" text-white px-3 py-[11px] rounded-md w-3/6 mt-3  text-sm tracking-wide  bg-gray-800 hover:bg-[#222] focus:outline-none"
              >
                {paymentMethod === "COD" ? "Đặt Hàng" : "Đặt Hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
