import { X } from "lucide-react";

export default function ConfirmModal({
  title,
  description,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed font-[Inter] inset-0 bg-gray-600/50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl mb-4">{title}</h2>
        <p className="mb-6">{description}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Так, підтвердити
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}
