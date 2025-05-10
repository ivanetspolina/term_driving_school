import { Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthInputField({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  isPassword = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="form-group">
      <div className="mb-2 block">
        <Label htmlFor={id}>{label}</Label>
      </div>
      <div className="relative flex items-center">
        <TextInput
          id={id}
          type={inputType}
          placeholder={placeholder}
          className="flex-grow w-full"
          style={isPassword ? { paddingRight: "2.5rem" } : {}}
          required={required}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex flex-shrink-0 items-center pr-2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

    </div>
  );
}
