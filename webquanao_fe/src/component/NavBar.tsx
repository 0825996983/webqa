import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import CartItem from "./le/CartItem";
import { useShoppingContext } from "./contexts/ShoppingContext";
import dinhDangso from "./ultis/Dinhdangso";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface NavBarProps {
  searchKeywords: string;
  setSearchKeyWords: (keyWord: string) => void;
}

type CartItemType = {
  productId: number;
  productName?: string;
  price: number;
  listPrice: number;
  description: string;
  quantity: number;
  size: string;
  color: string;
  imageData: string;
};

export default function NavBar({
  searchKeywords,
  setSearchKeyWords,
}: NavBarProps) {
  const [searchInput, setSearchInput] = useState(true);
  const [mdOptionsToggle, setMdOptionsToggle] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [temporaryKeyword, setTemporaryKeyword] = useState("");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartQty, setCartQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const { token, user } = useAuth();
  

  const fetchCartItems = () => {
    if (user && token) {
      axios
        .get(`http://localhost:8080/api/cart/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
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
  };

  
  useEffect(() => {  
    
    // Fetch dữ liệu giỏ hàng lần đầu tiên
    fetchCartItems();

    // // Thiết lập interval để tự động gọi lại API sau mỗi 5 giây
    const intervalId = setInterval(() => {
      fetchCartItems();
    }, 1000); // Mỗi 5 giây

    // Cleanup khi component unmount
    return () => clearInterval(intervalId);
  }, [token, user]); // Chạy lại khi token hoặc user thay đổi

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTemporaryKeyword(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchKeyWords(temporaryKeyword); // Sử dụng `temporaryKeyword`
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false); // Close cart if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" dark:bg-gray-950">
      <div>
        <div className="hello  relative">
          {/* For md screen size */}
          <div
            id="md-searchbar"
            className={`${
              mdOptionsToggle ? "hidden" : "flex"
            } bg-white dark:bg-gray-900 lg:hidden py-5 px-6 items-center justify-between`}
          >
            <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
              <div>
                <svg
                  className="fill-stroke"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.9984 18.9999L14.6484 14.6499"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for products"
                className="text-sm leading-none dark:text-gray-300 dark:bg-gray-900 text-gray-600 focus:outline-none"
              />
            </div>
            <div className="space-x-6">
              <button
                aria-label="view favourites"
                className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <svg
                  className="fill-stroke"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8921 3.07357C13.5516 2.73291 13.1473 2.46267 12.7023 2.2783C12.2574 2.09392 11.7804 1.99902 11.2988 1.99902C10.8171 1.99902 10.3402 2.09392 9.89521 2.2783C9.45023 2.46267 9.04595 2.73291 8.70544 3.07357L7.99878 3.78024L7.29211 3.07357C6.60432 2.38578 5.67147 1.99938 4.69878 1.99938C3.72609 1.99938 2.79324 2.38578 2.10544 3.07357C1.41765 3.76137 1.03125 4.69422 1.03125 5.66691C1.03125 6.6396 1.41765 7.57245 2.10544 8.26024L2.81211 8.96691L7.99878 14.1536L13.1854 8.96691L13.8921 8.26024C14.2328 7.91974 14.503 7.51545 14.6874 7.07048C14.8718 6.6255 14.9667 6.14857 14.9667 5.66691C14.9667 5.18525 14.8718 4.70831 14.6874 4.26334C14.503 3.81836 14.2328 3.41408 13.8921 3.07357V3.07357Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                aria-label="go to cart"
                className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <svg
                  className="fill-stroke"
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.66667 1L1 4.2V15.4C1 15.8243 1.1873 16.2313 1.5207 16.5314C1.8541 16.8314 2.30628 17 2.77778 17H15.2222C15.6937 17 16.1459 16.8314 16.4793 16.5314C16.8127 16.2313 17 15.8243 17 15.4V4.2L14.3333 1H3.66667Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 4.2002H17"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5564 7.3999C12.5564 8.2486 12.1818 9.06253 11.515 9.66264C10.8482 10.2628 9.94386 10.5999 9.00087 10.5999C8.05788 10.5999 7.15351 10.2628 6.48671 9.66264C5.81991 9.06253 5.44531 8.2486 5.44531 7.3999"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* For md screen size */}
          {/* For large screens */}
          <div className="dark:bg-gray-900 bg-gray-50 px-6 py-9 m-1">
            <div className="container mx-auto flex items-center justify-between">
              <h1
                className="md:w-2/12 cursor-pointer text-gray-800 dark:text-white"
                aria-label="the Crib."
              >
                <svg
                  className="fill-stroke"
                  width={93}
                  height={19}
                  viewBox="0 0 93 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.272 6V9.336H7.008V13.392C7.008 13.952 7.128 14.352 7.368 14.592C7.624 14.832 8 14.952 8.496 14.952C8.848 14.952 9.152 14.92 9.408 14.856C9.664 14.776 9.904 14.672 10.128 14.544L10.44 17.376C10.04 17.648 9.512 17.856 8.856 18C8.216 18.16 7.584 18.24 6.96 18.24C5.424 18.24 4.24 17.936 3.408 17.328C2.576 16.704 2.16 15.648 2.16 14.16V9.336H0.192V6H2.16V3.384L7.008 2.04V6H10.272ZM12.1916 18V1.056H17.0396V8.328C17.7436 6.616 18.9996 5.76 20.8076 5.76C22.0236 5.76 22.9836 6.12 23.6876 6.84C24.3916 7.544 24.7436 8.56 24.7436 9.888V18H19.8956V11.184C19.8956 10.496 19.7836 10.024 19.5596 9.768C19.3516 9.512 19.0556 9.384 18.6716 9.384C18.1916 9.384 17.7996 9.568 17.4956 9.936C17.1916 10.304 17.0396 10.888 17.0396 11.688V18H12.1916ZM33.2184 18.24C31.1384 18.24 29.5064 17.696 28.3224 16.608C27.1384 15.52 26.5464 13.984 26.5464 12C26.5464 10.672 26.8184 9.544 27.3624 8.616C27.9064 7.688 28.6664 6.984 29.6424 6.504C30.6184 6.008 31.7464 5.76 33.0264 5.76C34.3384 5.76 35.4504 6.008 36.3624 6.504C37.2904 6.984 37.9944 7.656 38.4744 8.52C38.9704 9.384 39.2184 10.392 39.2184 11.544C39.2184 12.136 39.1784 12.64 39.0984 13.056H31.2024C31.3144 13.776 31.5384 14.272 31.8744 14.544C32.2264 14.8 32.6904 14.928 33.2664 14.928C33.7624 14.928 34.1544 14.824 34.4424 14.616C34.7464 14.408 34.9624 14.12 35.0904 13.752L38.9784 14.904C38.7704 15.64 38.3784 16.256 37.8024 16.752C37.2264 17.248 36.5384 17.624 35.7384 17.88C34.9384 18.12 34.0984 18.24 33.2184 18.24ZM33.0264 9.048C32.5144 9.048 32.1064 9.192 31.8024 9.48C31.5144 9.768 31.3224 10.256 31.2264 10.944H34.6344C34.5704 10.32 34.4104 9.848 34.1544 9.528C33.9144 9.208 33.5384 9.048 33.0264 9.048Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M46.9723 5.76C48.3163 5.76 49.4203 5.952 50.2843 6.336C51.1643 6.72 51.8283 7.208 52.2763 7.8C52.7243 8.392 52.9803 9.016 53.0443 9.672L48.5563 11.04C48.5083 10.384 48.3723 9.896 48.1483 9.576C47.9403 9.256 47.6043 9.096 47.1403 9.096C46.5323 9.096 46.0763 9.32 45.7723 9.768C45.4843 10.216 45.3403 10.976 45.3403 12.048C45.3403 13.168 45.5083 13.928 45.8443 14.328C46.1803 14.712 46.6203 14.904 47.1643 14.904C48.0443 14.904 48.5483 14.32 48.6763 13.152L53.0203 14.52C52.9563 15.208 52.6763 15.832 52.1803 16.392C51.7003 16.952 51.0363 17.4 50.1883 17.736C49.3403 18.072 48.3403 18.24 47.1883 18.24C45.1083 18.24 43.4683 17.696 42.2683 16.608C41.0683 15.52 40.4683 13.984 40.4683 12C40.4683 10.672 40.7403 9.544 41.2843 8.616C41.8283 7.688 42.5883 6.984 43.5643 6.504C44.5403 6.008 45.6763 5.76 46.9723 5.76ZM54.6604 18V6H59.0044L59.1484 8.808C59.4204 7.864 59.8444 7.12 60.4204 6.576C61.0124 6.032 61.7804 5.76 62.7244 5.76C63.0604 5.76 63.3244 5.792 63.5164 5.856C63.7244 5.904 63.8844 5.968 63.9964 6.048L63.5644 9.984C63.4044 9.92 63.1964 9.864 62.9404 9.816C62.6844 9.768 62.3884 9.744 62.0524 9.744C61.3324 9.744 60.7244 9.944 60.2284 10.344C59.7484 10.728 59.5084 11.312 59.5084 12.096V18H54.6604ZM67.5609 4.944C66.6009 4.944 65.9049 4.784 65.4729 4.464C65.0569 4.128 64.8489 3.576 64.8489 2.808C64.8489 2.04 65.0569 1.488 65.4729 1.152C65.9049 0.815999 66.6009 0.647999 67.5609 0.647999C68.5369 0.647999 69.2329 0.815999 69.6489 1.152C70.0649 1.488 70.2729 2.04 70.2729 2.808C70.2729 3.576 70.0649 4.128 69.6489 4.464C69.2329 4.784 68.5369 4.944 67.5609 4.944ZM69.9849 6V18H65.1369V6H69.9849ZM80.6843 18.24C79.7083 18.24 78.8763 17.968 78.1883 17.424C77.5163 16.864 77.0283 16.136 76.7243 15.24L76.5803 18H72.3323V1.056H77.1803V8.064C77.5003 7.376 77.9643 6.824 78.5723 6.408C79.1803 5.976 79.9483 5.76 80.8763 5.76C82.2523 5.76 83.3563 6.312 84.1883 7.416C85.0203 8.52 85.4363 10.064 85.4363 12.048C85.4363 14.016 85.0123 15.544 84.1643 16.632C83.3323 17.704 82.1723 18.24 80.6843 18.24ZM78.8363 14.784C79.3803 14.784 79.8043 14.576 80.1083 14.16C80.4123 13.744 80.5643 13.024 80.5643 12C80.5643 10.976 80.4123 10.264 80.1083 9.864C79.8043 9.448 79.3803 9.24 78.8363 9.24C78.3083 9.24 77.9003 9.48 77.6123 9.96C77.3243 10.44 77.1803 11.12 77.1803 12C77.1803 12.944 77.3243 13.648 77.6123 14.112C77.9163 14.56 78.3243 14.784 78.8363 14.784ZM89.451 13.44C90.299 13.44 90.955 13.648 91.419 14.064C91.899 14.48 92.139 15.064 92.139 15.816C92.139 16.568 91.899 17.152 91.419 17.568C90.955 17.984 90.299 18.192 89.451 18.192C88.603 18.192 87.939 17.984 87.459 17.568C86.995 17.152 86.763 16.568 86.763 15.816C86.763 15.064 86.995 14.48 87.459 14.064C87.939 13.648 88.603 13.44 89.451 13.44Z"
                    fill="currentColor"
                  />
                </svg>
              </h1>
              <ul className="hidden w-8/12 md:flex items-center justify-center space-x-8">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 font-serif"
                        : "dark:text-white text-base text-gray-800 focus:outline-none  hover:underline"
                    }
                  >
                    Homes
                  </NavLink>
                </li>

                <li className="nav-item dropdown">
                  <NavLink
                    to="/product"
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 font-serif" // Màu đỏ và chữ đậm cho trang hiện tại
                        : "dark:text-white text-base text-gray-800 focus:outline-none hover:text-red-600 transition duration-200 ease-in-out"
                    }
                    id="navbarDropdown2"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Product
                  </NavLink>
                  <ul
                    className="dropdown-menu border-gray-300 shadow-lg rounded-md mt-2"
                    aria-labelledby="navbarDropdown2"
                  >
                    <li>
                      <NavLink
                        to="/product"
                        className={({ isActive }) =>
                          isActive
                            ? "text-red-600 dropdown-item text-base focus:outline-none hover:bg-gray-100  font-serif"
                            : "dropdown-item text-base text-gray-800 focus:outline-none hover:bg-gray-100 hover:text-red-600 transition duration-200"
                        }
                      >
                        All
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/2"
                        className={({ isActive }) =>
                          isActive
                            ? "text-red-600 dropdown-item text-base focus:outline-none hover:bg-gray-100 font-serif"
                            : "dropdown-item text-base text-gray-800 focus:outline-none hover:bg-gray-100 hover:text-red-600 transition duration-200"
                        }
                      >
                        Top
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/1"
                        className={({ isActive }) =>
                          isActive
                            ? "text-red-600 dropdown-item text-base focus:outline-none hover:bg-gray-100  font-serif"
                            : "dropdown-item text-base text-gray-800 focus:outline-none hover:bg-gray-100 hover:text-red-600 transition duration-200"
                        }
                      >
                        Bottom
                      </NavLink>
                    </li>
                  </ul>
                </li>

                {/* <li>
                  <NavLink
                    to="#"
          
                    className={({ isActive }) =>
                      isActive ? 'text-red-600 font-serif' :"dark:text-white text-base text-gray-800 focus:outline-none hover:underline"
                    }
                    
                  >
                    Lookbook
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to="/aboutus"
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 font-serif"
                        : "dark:text-white text-base text-gray-800 focus:outline-none hover:underline"
                    }
                  >
                    About us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blog"
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 font-serif"
                        : "dark:text-white text-base text-gray-800 focus:outline-none hover:underline"
                    }
                  >
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 font-serif"
                        : "dark:text-white text-base text-gray-800 focus:outline-none hover:underline"
                    }
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
              <div className="md:w-2/12 justify-end flex items-center space-x-4 xl:space-x-8">
                {/* ô search */}
                <div className="hidden lg:flex items-center">
                  <button
                    onClick={() => setSearchInput(!searchInput)}
                    aria-label="search items"
                    className="text-gray-800 dark:hover:text-gray-300 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 "
                  >
                    <svg
                      className="fill-stroke "
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 11C5 15.4183 8.58172 19 13 19C17.4183 19 21 15.4183 21 11C21 6.58172 17.4183 3 13 3C8.58172 3 5 6.58172 5 11Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.99961 20.9999L7.34961 16.6499"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <input
                    onKeyDown={handleKeyDown}
                    onChange={onSearchInputChange}
                    value={temporaryKeyword}
                    id="searchInput"
                    type="text"
                    placeholder="search"
                    className={` ${
                      searchInput ? "hidden" : ""
                    } text-sm dark:bg-gray-900 dark:placeholder-gray-300 text-gray-600 rounded ml-1 border border-transparent focus:outline-none focus:border-gray-400 px-1 `}
                  />
                </div>

                <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
                  {/* nút yêu thích */}
                  <button
                    aria-label="view favourites"
                    className="text-gray-800 dark:hover:text-gray-300 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    <svg
                      className="fill-stroke"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* nút giỏ hàng */}
                <div>
      <div className="relative">
        {/* Nút giỏ hàng */}
        <button onClick={toggleCart} aria-label="go to cart" className="relative">
          <svg
            className="fill-stroke"
            width={26}
            height={26}
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 1L1 5.8V22.6C1 23.2365 1.28095 23.847 1.78105 24.2971C2.28115 24.7471 2.95942 25 3.66667 25H22.3333C23.0406 25 23.7189 24.7471 24.219 24.2971C24.719 23.847 25 23.2365 25 22.6V5.8L21 1H5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 5.7998H25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.3346 10.6001C18.3346 11.8731 17.7727 13.094 16.7725 13.9942C15.7723 14.8944 14.4158 15.4001 13.0013 15.4001C11.5868 15.4001 10.2303 14.8944 9.23007 13.9942C8.22987 13.094 7.66797 11.8731 7.66797 10.6001"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Display the cart count */}
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
            {cartQty}
          </span>
        </button>

        {/* Hiển thị giỏ hàng khi di chuột vào hoặc khi giỏ hàng mở */}
        {(isCartOpen) && (
          <div
            ref={cartRef}
            className="absolute top-[-300px] right-0 z-50"
          >
            <div
              className="fixed top-24 right-4 w-screen max-w-sm border border-gray-600 bg-gray-100 px-4 py-8 sm:px-6 lg:px-8"
              aria-modal="true"
              role="dialog"
            >
              <button
                className="absolute end-4 top-4 text-gray-600 transition hover:scale-110"
                onClick={() => setIsCartOpen(false)}
              >
                <span className="sr-only">Close cart</span>
              </button>
              <div className="space-y-6">
                <ul className="space-y-4">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <CartItem key={item.productId} {...item} />
                    ))
                  ) : (
                    <div className="text-center text-black h-5">
                      Không có sản phẩm nào trong giỏ hàng
                    </div>
                  )}
                </ul>

                {/* Phần tổng giá trị */}
                {cartItems.length > 0 && (
                  <div className="space-y-4 text-center">
                    <div className="border-t-[1px] border-dashed border-gray-400"></div>
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Total:</span>
                      <span className="text-sm font-medium text-gray-900">
                        <span className="text-base font-medium ml-1 text-red-600 mb-20">
                          {totalPrice.toLocaleString()}
                        </span>
                        <span
                          className="text-sm font-medium text-red-600 mb-20"
                          style={{ fontSize: "0.8rem" }}
                        >
                          đ
                        </span>
                      </span>
                    </div>

                    <Link
                      to="/cart"
                      className="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
                    >
                      Xem giỏ hàng ({cartQty})
                    </Link>
                    <Link
                      to="/checkout"
                      className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                    >
                      Thanh toán
                    </Link>
                    <Link
                      to="/product"
                      className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

                {/* account */}
                <div>
                  <a href="/login">
                    <button
                      aria-label="view favourites"
                      className="text-gray-800 dark:hover:text-gray-300 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                    >
                      <svg
                        className="fill-stroke"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </a>
                </div>

                {/* nút menu mobile */}
                <div className="flex lg:hidden">
                  <button
                    aria-label=""
                    onClick={() => setMdOptionsToggle(!mdOptionsToggle)}
                    className="text-black dark:text-white dark:hover:text-gray-300 hidden md:flex focus:outline-none focus:ring-2 rounded focus:ring-gray-600"
                  >
                    <svg
                      className="fill-stroke"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 18H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="open menu"
                    onClick={() => setShowMenu(true)}
                    className="text-black dark:text-white dark:hover:text-gray-300 md:hidden focus:outline-none focus:ring-2 rounded focus:ring-gray-600"
                  >
                    <svg
                      className="fill-stroke"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 18H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* For small screen */}
          <div
            id="mobile-menu"
            className={`${
              showMenu ? "flex" : "hidden"
            } absolute dark:bg-gray-900 z-10 inset-0 md:hidden bg-white flex-col h-screen w-full`}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 p-4">
              <div className="flex items-center space-x-3">
                <div>
                  <svg
                    className="fill-stroke text-gray-800 dark:text-white"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.9984 18.9999L14.6484 14.6499"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for products"
                  className="text-sm dark:bg-gray-900 text-gray-600 placeholder-gray-600 dark:placeholder-gray-300 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowMenu(false)}
                aria-label="close menu"
                className="focus:outline-none focus:ring-2 rounded focus:ring-gray-600"
              >
                <svg
                  className="fill-stroke text-gray-800 dark:text-white"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4L12 12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 p-4">
              <ul className="flex flex-col space-y-6">
                <li>
                  <a
                    href="#"
                    className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    Home
                    <div>
                      <svg
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 3L7.5 6L4.5 9"
                          stroke="currentColor"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    Furniture
                    <div>
                      <svg
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 3L7.5 6L4.5 9"
                          stroke="currentColor"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    Lookbook
                    <div>
                      <svg
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 3L7.5 6L4.5 9"
                          stroke="currentColor"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    Support
                    <div>
                      <svg
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 3L7.5 6L4.5 9"
                          stroke="currentColor"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="h-full flex items-end">
              <ul className="flex flex-col space-y-8 bg-gray-50 w-full py-10 p-4 dark:bg-gray-800"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
