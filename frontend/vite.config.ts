import { defineConfig } from "vite";
// import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	// resolve: {
	// 	alias: {
	// 		"@components": path.resolve(__dirname, "src/components"),
	// 		"@api": path.resolve(__dirname, "src/api"),
	// 		"@constants": path.resolve(__dirname, "src/constants"),
	// 		"@hooks": path.resolve(__dirname, "src/hooks"),
	// 		"@interfaces": path.resolve(__dirname, "src/interfaces"),
	// 		"@layouts": path.resolve(__dirname, "src/layouts"),
	// 		"@pages": path.resolve(__dirname, "src/pages"),
	// 		"@styles": path.resolve(__dirname, "src/styles"),
	// 		"@customTypes": path.resolve(__dirname, "src/types"),
	// 		"@utils": path.resolve(__dirname, "./src/utils"),
	// 		"@config": path.resolve(__dirname, "src/config"),
	// 	},
	// },
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwindcss(),
		tsconfigPaths(),
	],
});
