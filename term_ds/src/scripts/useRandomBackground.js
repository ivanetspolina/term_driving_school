import { useState, useEffect } from "react";

import grassBg1 from "../assets/svg/green-grass-background1.svg";
import grassBg2 from "../assets/svg/grass-texture-background1.svg";

const BACKGROUNDS = [grassBg1, grassBg2];

export default function useRandomBackground(intervalMs = 200) {
  const [bg, setBg] = useState(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * BACKGROUNDS.length);
    setBg(BACKGROUNDS[idx]);
  }, [intervalMs]);

  return bg;
}
