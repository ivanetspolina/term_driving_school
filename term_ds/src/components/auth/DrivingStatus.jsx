import { useState } from "react";
import { PencilLine } from "lucide-react";

export default function DrivingStatusEdit({
  value = "",
  label = "",
  onSave = () => {},
}) {
  const [edit, setEdit] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const options = ["Так", "Навчаюсь", "Ні"];

  const handleSave = () => {
    if (!tempValue) return;
    onSave(tempValue);
    setEdit(false);
  };

  return (
    <div className="profile-info">
      <h2>{label}</h2>
      {edit ? (
        <>
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              Зберегти
            </button>
            <button
              onClick={() => setEdit(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Скасувати
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{value || "Не вказано"}</p>
          <button
            type="button"
            className="btn-profile-edit"
            onClick={() => {
              setEdit(true);
              setTempValue(value || "");
            }}
          >
            <PencilLine size={15} />
          </button>
        </>
      )}
    </div>
  );
}