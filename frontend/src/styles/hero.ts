// hero.ts
import { heroui } from "@heroui/theme";
import plugin from "tailwindcss/plugin.js";

const theme: ReturnType<typeof plugin> = heroui();

export default theme;
