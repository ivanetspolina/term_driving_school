import Header from "../components/Header.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { RunTestHeader } from "../components/test-run/RunTestHeader.jsx";
import { RunTestButton } from "../components/test-run/RunTestButton.jsx";
import StartSection from "../components/test-run/StartSection.jsx";

export default function RunTest() {
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
