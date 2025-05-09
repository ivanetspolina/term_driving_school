import { useState, useEffect } from "react";

import grassBg1 from "../assets/svg/green-grass-background 1.svg";
import grassBg2 from "../assets/svg/grass-texture-background 1.svg";

const BACKGROUNDS = [grassBg1, grassBg2];

export default function useRandomBackground(intervalMs = 500) {
  const [bg, setBg] = useState(null);

  useEffect(() => {
    const pick = () => {
      const idx = Math.floor(Math.random() * BACKGROUNDS.length);
      setBg(BACKGROUNDS[idx]);
    };

    pick();

    const timer = setInterval(pick, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return bg;
}
