import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/firestore"; // Ajusta la ruta según tu estructura
import "./Orders.css";

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        // 1. Obtener email del localStorage
        const userInfo = JSON.parse(localStorage.getItem("user_info_storage"));
        if (!userInfo?.email) return;

        // 2. Buscar usuario en colección `users` por email
        const usersQuery = query(
          collection(db, "users"),
          where("email", "==", userInfo.email)
        );
        const userSnapshot = await getDocs(usersQuery);

        if (userSnapshot.empty) {
          console.log("Usuario no encontrado");
          return;
        }

        const userId = userSnapshot.docs[0].id; // Obtener ID del usuario

        // 3. Buscar órdenes del usuario en colección `orders`
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", userId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);

        // 4. Extraer y aplanar todos los productos
        const allProducts = [];
        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data();
          console.log("order data: ", orderData);
          let productsArray = orderData.products;
          if (typeof productsArray === "string") {
            try {
              productsArray = JSON.parse(productsArray);
            } catch (e) {
              console.error("Error parsing JSON:", e);
              return;
            }
          }

          if (Array.isArray(productsArray)) {
            allProducts.push(...productsArray);
          }
        });

        console.log("Final products:", allProducts); // Verifica aquí
        setProducts(allProducts);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div className="orders-container">
      <h2>Mis Productos Comprados</h2>
      {products.length === 0 ? (
        <p>No hay productos en tus pedidos.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={`${product.id}-${index}`}>
                <td>{product.name}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
