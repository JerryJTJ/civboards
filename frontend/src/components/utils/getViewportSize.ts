type Viewport = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export default function getViewportSize(width: number): Viewport {
	// Binary Search
	if (width < 1024) {
		if (width < 768) {
			if (width < 640) return "xs";

			return "sm";
		}

		return "md";
	} else {
		if (width < 1280) return "lg";
		if (width < 1356) return "xl";

		return "2xl";
	}
}
