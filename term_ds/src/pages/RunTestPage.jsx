import Header from "../components/Header.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { RunTestHeader } from "../components/RunTestHeader.jsx";
import { RunTestButton } from "../components/RunTestButton.jsx";
import StartSection from "../components/StartSection.jsx";

export default function Index() {
  return (
    <>
      <Header />

      <main className="h-screen center-main">
        <div className="h-full grid grid-rows-[auto_1fr] grid-cols-[75%_25%]">
          <div className="row-start-1 col-start-1 flex justify-between">
            <RunTestHeader topic="Правила дорожнього руху" questionCount={20} />
          </div>
          <StartSection />
          <RunTestButton />
        </div>
      </main>
    </>
  );
}
