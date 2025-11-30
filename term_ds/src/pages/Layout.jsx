import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  return (
    <>
        <Outlet />
        {/* Контейнер для показу toast-повідомлень */}
        <ToastContainer
        position="top-right"        
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "70px" }}
      />
    </>
  )
}
