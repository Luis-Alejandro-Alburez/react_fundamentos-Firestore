import "./Login.css"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../../config/firestore";
import { CommonConstants } from "../../../utils/commonConstants";
import { StoreContext } from "../../context/StoreContext";

export default function Login() {

  const [email, setEmail] = useState("")
  const { setIsLoggedIn } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(()=>{
    const userInfo = localStorage.getItem(CommonConstants.USER_INFO_STORAGE)
    if(userInfo?.email)
      navigate("/products")
  }, [navigate])

  const addNewEmail = async () => {
    try {
      await addDoc(collection(db, CommonConstants.USER_REF), {
        email
      });
    }catch(errMsg) {
      console.error(errMsg)
      throw new Error("Add email error")
    }
  }

  const userInCollectionSize = async () => {
    const collectionRef = collection(db, CommonConstants.USER_REF)
    const q = query(collectionRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length
  }

  const handleLogin = async () => {
    try {
      const usersCollectionSize = await userInCollectionSize();
      if(usersCollectionSize === 0)
        await addNewEmail()

      localStorage.setItem(CommonConstants.USER_INFO_STORAGE, JSON.stringify({email}))

      setIsLoggedIn(true)

      navigate("/products")

    }catch(errMsg) {
      console.error("Se ha encontrado un error al manejar el usuario: ", errMsg)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al ingresar a la aplicación",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin()
  }

  return (
    <>
      <form onSubmit={(e)=>{handleSubmit(e)}}>
        <label>Email:</label><input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
        <button type="submit">Entrar</button>
      </form>
    </>
  )
}