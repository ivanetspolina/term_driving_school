import { generateNewTest } from "../../scripts/resultTestFunc";

export default function RerunTestBtn() {
  return (
    <>
      <div className="mt-4 mx-auto w-fit">
        <button
          className="w-full text-white bg-purple-700 hover:bg-purple-800 focus:outline-none hover:ring-2 hover:ring-purple-300 font-medium rounded-lg text-base px-5 py-2.5"
          onClick={() => generateNewTest()}
        >
          Згенерувати цей тест ще раз
        </button>
      </div>
    </>
  );
}
