import "./Cart.css"
import { db } from "../../../config/firestore";
import { useEffect, useState } from "react";
import { loadFromLocalStorage, removeFromLocalStorage } from "../../../utils/localStorage";
import { CommonConstants } from "../../../utils/commonConstants";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Cart() {

  const [cart, setCart] = useState();

  const navigate = useNavigate()

  useEffect(()=>{
    const cartFromLocalStorage = loadFromLocalStorage(CommonConstants.CART_STORAGE)
    setCart(cartFromLocalStorage);
  }, [])

  const createOrder = async () => {

    const userLocal = loadFromLocalStorage(CommonConstants.USER_INFO_STORAGE);

    const collectionRef = collection(db, CommonConstants.USER_REF)
    const q = query(collectionRef, where("email", "==", userLocal.email));
    const querySnapshot = await getDocs(q);

    const [userInfo] = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))

    try {
      await addDoc(collection(db, CommonConstants.ORDER_REF), {
        userId: userInfo.id,
        products: JSON.stringify(cart),
      });

      removeFromLocalStorage(CommonConstants.CART_STORAGE)

      navigate("/products")

      Swal.fire('La orden ha sido generada exitosamente');
    }catch(errMsg) {
      console.error("Error al crear la orden: ", errMsg)
    }
  }

  return (
    <>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Imagen</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Sub total</th>
          </tr>
        </thead>
        <tbody>
          {cart ? cart.map(c => (
            <tr key={c.id}>
              <td>
                <p>{c.name}</p>
              </td>
              <td>
                <img src={c.image} />
              </td>
              <td>
                <p>{c.quantity}</p>
              </td>
              <td>
                <p>Q{c.price}</p>
              </td>
              <td>
                <p>Q{c.price*c.quantity}</p>
              </td>
            </tr>
          )): <tr><td colSpan={5}>No existen productos en el carrito</td></tr>}
        </tbody>
      </table>

      {cart && (
        <div className="finish-order-container">
          <p>Total: Q{cart.reduce((acc,c) => (c.quantity*c.price) + acc, 0)}</p>
          <button onClick={createOrder}>Crear orden</button>
        </div>
      )}
    </>
  );
}