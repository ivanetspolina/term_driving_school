import Header from "../components/Header.jsx";
import IndexFooter from "../components/Footer.jsx";

export default function Index() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow"></main>

        <IndexFooter />
      </div>
    </>
  );
}
