import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth"; 
import dinhDangso from "../ultis/Dinhdangso"; 

type CartItemProps = {
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

const CartItem = ({
  productId, 
  productName,
  price,
  quantity,
  imageData,
}: CartItemProps) => {
  const { token, user } = useAuth(); 

  
  const handleIncrease = async () => {
    if (!user?.id || !productId) {
      console.error("User or Product ID is undefined");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/cart/${user.id}/${productId}/increase`, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  
  const handleDecrease = async () => {
    if (!user?.id || !productId) {
      console.error("User or Product ID is undefined");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/cart/${user.id}/${productId}/decrease`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };


  const handleRemove = async () => {
    if (!user?.id || !productId) {
      console.error("User or Product ID is undefined");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/cart/${user.id}/${productId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
     
      
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  return (
    <div>
      <li className="flex items-center gap-4 m-2">
        
        <img
          src={imageData}
          alt={productName}
          className="size-20 rounded object-cover"
        />
        <div>
          <h3 className="text-sm text-gray-900">{productName}</h3>
          <p className="text-sm text-red-600">
            {dinhDangso(quantity * price)} đ 
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            className="text-gray-600 transition hover:text-red-600"
            onClick={handleDecrease} 
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            readOnly
            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600"
          />
          <button
            className="text-gray-600 transition hover:text-green-600 mr-3"
            onClick={handleIncrease} 
          >
            +
          </button>

          <button
            className="text-gray-600 transition hover:text-red-600"
            onClick={handleRemove} 
          >
            <span className="sr-only">Remove item</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </li>
    </div>
  );
};

export default CartItem;
