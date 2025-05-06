import { useState } from "react";
import Header from "../components/Header.jsx";
import { PencilLine, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function Profile() {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(false);
    console.log("Акаунт видалено");
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <>
      <Header />
      <main className="profile-main center-main">
        <div className="profile-title text-title">
          <h1>Профіль</h1>
        </div>

        <div className="text-container shadow">
          <div className="profile-info">
            <h2>Ім'я</h2>
            <p>Маріам</p>
            <button type="button" className="btn-profile-edit">
              <PencilLine size={15} />
            </button>
          </div>

          <div className="profile-info">
            <h2>Пошта</h2>
            <p>ariel.l@example.com</p>
            <button type="button" className="btn-profile-edit">
              <PencilLine size={15} />
            </button>
          </div>

          <div className="profile-info">
            <h2>Пароль</h2>
            <p>••••••••</p>
            <button type="button" className="btn-profile-edit">
              <PencilLine size={15} />
            </button>
          </div>

          <div className="profile-delete flex justify-center mt-[10px]">
            <button
              type="button"
              className="btn-profile-delete cursor-pointer flex items-center gap-[8px] px-6 py-3 rounded-full transition-colors"
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} />
              Видалити акаунт
            </button>
          </div>
        </div>
      </main>

      {showConfirmDelete && (
        <ConfirmModal
          title="Підтвердіть дію"
          description="Ви точно хочете видалити акаунт?"
          cancelLabel="Скасувати"
          confirmLabel="Так, підтвердити"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}
