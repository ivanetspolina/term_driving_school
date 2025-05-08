import { Button } from "flowbite-react";

export default function AuthButton({
  type = "button",
  onClick,
  disabled = false,
  children,
  className = "",
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${className}`}
    >
      {children}
    </Button>
  );
}

// import { Button } from "flowbite-react";
// import { FcGoogle } from "react-icons/fc";
//
// export default function AuthButton() {
//   return (
//     <>
//       <Button type="submit" className="cursor-pointer">
//         Увійти
//       </Button>
//
//       <div className="my-4 flex items-center">
//         <hr className="flex-grow border-gray-300" />
//         <span className="px-4 text-sm text-gray-500">в інший спосіб</span>
//         <hr className="flex-grow border-gray-300" />
//       </div>
//
//       <div className="flex justify-center">
//         <Button
//           type="button"
//           className="flex items-center gap-3 border cursor-pointer bg-white border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition w-full justify-center"
//         >
//           <FcGoogle size={20} />
//           <span className="text-sm font-medium text-black">
//             Увійти через Google
//           </span>
//         </Button>
//       </div>
//     </>
//   );
// }
