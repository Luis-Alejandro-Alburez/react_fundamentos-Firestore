import { Link, useNavigate } from "react-router-dom";
import { CommonConstants } from "../../utils/commonConstants";
import { useContext, useEffect } from "react";
import {
  loadFromLocalStorage,
  removeFromLocalStorage,
} from "../../utils/localStorage";
import { StoreContext } from "../context/StoreContext";

export function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(StoreContext);

  useEffect(() => {
    const userInfo = loadFromLocalStorage(CommonConstants.USER_INFO_STORAGE);
    if (userInfo) setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  const signout = () => {
    removeFromLocalStorage(CommonConstants.USER_INFO_STORAGE);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    isLoggedIn && (
      <nav>
        <Link to={"/products"}>Productos</Link>
        <Link to={"/cart"}>Carrito de compra</Link>
        <Link to={"/orders"}>Ordenes</Link>
        <button onClick={signout}>Salir</button>
      </nav>
    )
  );
}
