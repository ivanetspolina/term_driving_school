import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScreenshotsSection() {
  const [showPhotos, setShowPhotos] = useState(false);

  const togglePhotos = () => {
    setShowPhotos(!showPhotos);
  };

  const photosFromDB = [
    { id: 1, url: "https://loremflickr.com/320/240", alt: "Скріншот 1" },
    { id: 2, url: "https://loremflickr.com/320/240", alt: "Скріншот 2" },
    { id: 3, url: "https://loremflickr.com/320/240", alt: "Скріншот 3" },
    { id: 4, url: "https://loremflickr.com/320/240", alt: "Скріншот 1" },
  ];

  return (
    <div className="mb-6 screenshots-section">
      <button
        onClick={togglePhotos}
        className="flex items-center font-['Nunito_Sans'] text-lg"
      >
        <span>Переглянути скріншоти</span>
        <ChevronDown
          className={`ml-2 transition-transform duration-300 ${showPhotos ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      {showPhotos && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {photosFromDB.map((photo) => (
            <div
              key={photo.id}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img src={photo.url} alt={photo.alt} className="w-full h-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
