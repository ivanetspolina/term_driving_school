import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import { PencilLine, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal.jsx";
import PasswordChange from "../components/auth/PasswordChange.jsx";
import EditNameField from "../components/profile/EditNameField.jsx";
import { apiRequest, apiUrl } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { setAlert } = useUI();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    const result = await apiRequest(apiUrl.deleteAccount, "DELETE");

    if (result?.message) {
      logout(); 
      localStorage.clear(); 
      setAlert("Акаунт успішно видалено", "success");
      navigate("/"); 
    } else {
      setAlert(result?.error || "Не вдалося видалити акаунт", "error");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handlePasswordEditClick = () => {
    setShowPasswordChange(true);
  };

  const handleClosePasswordChange = () => {
    setShowPasswordChange(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await apiRequest(apiUrl.profile, "GET");
      console.log("Отримано з профілю:", res);
      if (res.user) {
        setProfileData(res.user);
      } else if (res.error) {
        console.warn("Помилка від API:", res.error);
      }
    };
    fetchProfile();
  }, []);

  // if (isLoading) {
  //   return null;          
  // }

  return (
    <>
      <Header />
      <main className="profile-main center-main">
        <div className="profile-title text-title">
          <h1>Профіль</h1>
        </div>

        <div className="text-container shadow">
          <EditNameField
            label="Ім'я"
            value={profileData?.name || ""}
            onSave={async (newName) => {
              const result = await apiRequest(apiUrl.updateProfile, "PATCH", {name: newName, });
              if (result?.user) {
                setProfileData(result.user); 
                setAlert("Ім’я оновлено", "success");
              } else {
                setAlert(result?.error || "Помилка при оновленні імені", "error");
              }
            }}
          />

          <div className="profile-info">
            <h2>Пошта</h2>
            <p>{profileData?.email || "..."}</p>
          </div>

          <div className="profile-info">
            <h2>Пароль</h2>
            <p
              onClick={handlePasswordEditClick}
              className="cursor-pointer text-gray-400 hover:underline"
            >
              змінити пароль
            </p>
            <button
              onClick={handlePasswordEditClick}
              type="button"
              className="btn-profile-edit flex"
            >
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

      {showPasswordChange && (
        <PasswordChange onClose={handleClosePasswordChange} />
      )}
    </>
  );
}
