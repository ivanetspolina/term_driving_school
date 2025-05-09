import Header from "../components/Header.jsx";
import RerunTest from "../components/test-result/RerunTestButton.jsx";

export default function TestResult() {
  return (
    <>
      <Header />

      <main className="h-screen center-main">
        <RerunTest />
      </main>
    </>
  );
}
