/**
 * Main application entry point
 * This file is processed by esbuild
 */

import { Counter } from "./modules/counter.js";
import { ThemeSwitcher } from "./modules/theme.js";

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	console.log("⚡ App initialized with esbuild!");

	// Initialize counter
	const counterElement = document.getElementById("counter");
	if (counterElement) {
		const counter = new Counter(counterElement);
		counter.render();

		// Setup counter buttons
		document.getElementById("increment")?.addEventListener("click", () => {
			counter.increment();
		});

		document.getElementById("decrement")?.addEventListener("click", () => {
			counter.decrement();
		});

		document.getElementById("reset")?.addEventListener("click", () => {
			counter.reset();
		});
	}

	// Initialize theme switcher
	const themeToggle = document.getElementById("theme-toggle");
	if (themeToggle) {
		const themeSwitcher = new ThemeSwitcher();

		themeToggle.addEventListener("click", () => {
			themeSwitcher.toggle();
		});
	}

	// Add interactive effects to cards
	const cards = document.querySelectorAll(".card");
	cards.forEach((card) => {
		card.addEventListener("mouseenter", () => {
			card.style.transform = "translateY(-4px) scale(1.02)";
			card.style.transition = "transform 0.3s ease";
		});

		card.addEventListener("mouseleave", () => {
			card.style.transform = "translateY(0) scale(1)";
		});
	});

	// Display build info
	const buildInfo = document.getElementById("build-info");
	if (buildInfo) {
		const isDev = import.meta.url.includes("localhost");
		buildInfo.textContent = isDev
			? "Development build (not minified)"
			: "Production build (minified)";
	}
});
