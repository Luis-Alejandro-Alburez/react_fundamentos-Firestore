import './Products.css';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../config/firestore";
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localStorage';
import { CommonConstants } from '../../../utils/commonConstants';
import Swal from 'sweetalert2';

export default function Products() {

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProducts = async () => {

    setIsLoading(true);

    try {
      const collectionRef = collection(db, CommonConstants.PRODUCT_REF)
      const querySnapshot = await getDocs(collectionRef);
      const productsInCollection = querySnapshot.docs.map((doc) => {
        return {id: doc.id, ...doc.data()}
      });
      setProducts(productsInCollection)
    }catch(errMsg) {
      console.error("Error cargando productos: ", errMsg);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al encontrar los productos",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(()=>{
    loadProducts()
  },[])

  const evaluateAlert = (action) => {
    return action ? 
      Swal.fire("Se ha agregado el producto al carrito!") :
      Swal.fire("Se ha eliminado el producto del carrito!") 
  }

  const handleCart = (product, action=true) => {

    const cartInLocalStorage = loadFromLocalStorage(CommonConstants.CART_STORAGE) || [];

    const findProduct = cartInLocalStorage?.find(c => c.id === product.id);

    if(findProduct){
      const updatedCart = cartInLocalStorage.map(
        c => c.id === product.id ? {
          ...c,
          quantity: action ? c.quantity + 1 : c.quantity - 1 
        } : {...c}
      )

      const cartWithoutEmpty = updatedCart.filter(c => c.quantity > 0)
      saveToLocalStorage(CommonConstants.CART_STORAGE, cartWithoutEmpty);
      return evaluateAlert(action);
    }

    if(action) {
      saveToLocalStorage(CommonConstants.CART_STORAGE, [
        ...cartInLocalStorage,
        {
          ...product,
          quantity: 1
        }]);
    }

    evaluateAlert(action);

  }

  return (
    <>
      {isLoading ? <p>Cargando productos...</p> : 
        <div className="product-container">
          {products.length !== 0 ? products.map(product => (
            <div key={product.id} className="product-box">
              <b>{product.name}</b>
              <img src={product.image} />
              <p>Q{product.price}</p>
              <div className="product-btn-container">
                <button onClick={()=>handleCart(product)}>+</button>
                <button onClick={()=>handleCart(product, false)}>-</button>
              </div>
            </div>
          )) : <p>Productos no disponibles</p>}
        </div>
      }

    </>
  )
}