import useRandomBackground from "../../scripts/useRandomBackground.js";

export default function RuningSection() {
  const bg = useRandomBackground();

  return (
    <section
      className="runing-section block h-full min-h-[591px] row-start-2 col-start-1 p-4 rounded-[20px] bg-white relative overflow-hidden rounded-[20px]"
      style={{
        backgroundImage: bg ? `url(${bg})` : undefined,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></section>
  );
}
