import { useState } from "react";
import ConfirmModal from "./ConfirmModal.jsx";
import { Check } from "lucide-react";

export function RunTestButton({
  onPause = () => {},
  onCancel = () => {},
  onSnapshot = () => {},
}) {
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  const handlePauseClick = () => setShowPauseConfirm(true);
  const handleConfirmPause = () => {
    setShowPauseConfirm(false);
    onPause();
  };

  const handleCancelClick = () => setShowCancelConfirm(true);
  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    onCancel();
  };

  const handleSnapshotClick = () => {
    onSnapshot();
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 800);
  };

  return (
    <>
      <aside className="row-start-2 col-start-2 p-[32px] space-y-4">
        <button
          onClick={handlePauseClick}
          className="w-full text-white bg-purple-700 hover:bg-purple-800 focus:outline-none hover:ring-2 hover:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Пауза
        </button>

        <button
          onClick={handleCancelClick}
          className="w-full text-white bg-purple-700 hover:bg-purple-800 focus:outline-none hover:ring-2 hover:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Скасувати проходження
        </button>

        <button
          onClick={handleSnapshotClick}
          className="relative w-full text-white bg-purple-700 hover:bg-purple-800 focus:outline-none hover:ring-2 hover:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Зробити знімок завдання
          {snapshotSuccess && (
            <Check className="absolute right-4 top-1/2 w-5 h-5 text-white bg-green-500 rounded-full transform -translate-y-1/2" />
          )}
        </button>
      </aside>

      {showPauseConfirm && (
        <ConfirmModal
          title="Тест призупинено"
          description="Продовжити проходження тесту?"
          confirmLabel="Так, продовжити"
          cancelLabel="Ні, скасувати проходження"
          onConfirm={handleConfirmPause}
          onCancel={() => setShowPauseConfirm(false)}
        />
      )}

      {showCancelConfirm && (
        <ConfirmModal
          title="Хочете скасувати проходження тесту?"
          description="Втрачені відповіді не відновляться та не враховуватимуться до статистики."
          confirmLabel="Так, скасувати"
          cancelLabel="Ні, продовжити проходження"
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
    </>
  );
}
