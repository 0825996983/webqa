import { useEffect, useState } from "react";
import { LoginRequest, User } from "../models/UserModel.types";
import { BASE_LOCAL_API } from "../api/Request";

export const useAuth = () => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const login = async (request: LoginRequest) => {
    fetch(`${BASE_LOCAL_API}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: request.username,
        password: request.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          //TODO: set data to user
          setIsAuthenticated(true);
          return response.json();
        } else {
          throw new Error("Đăng nhập thất bại !");
        }
      })
      .then((data) => {
        const { jwt, user } = data;
        setUser(user);
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(user));

        setError("đăng nhập thành công");
      })
      .catch((error) => {
        console.error("đăng nhập thất bại ", error);
        setError(
          "Đăng nhập thất bại. vui lòng kiểm tra lại tên đăng nhập và mật khẩu"
        );
      });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      setToken(token);
      setUser(JSON.parse(user) as User);
    }
  }, []);

  return {
    login,
    user,
    error,
    token,
    isAuthenticated,
    setIsAuthenticated,
  };
};
