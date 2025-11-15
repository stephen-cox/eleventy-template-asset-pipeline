/**
 * Main application entry point
 * This file is processed by Webpack
 */

import { greet } from "./modules/greeting.js";
import { formatDate, capitalize } from "./modules/utils.js";

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	console.log("App initialized with Webpack!");

	// Display greeting
	const greeting = greet("Eleventy User");
	const greetingElement = document.getElementById("greeting");
	if (greetingElement) {
		greetingElement.textContent = greeting;
	}

	// Display current date
	const dateElement = document.getElementById("current-date");
	if (dateElement) {
		const formattedDate = formatDate(new Date());
		dateElement.textContent = `Today is ${formattedDate}`;
	}

	// Handle button clicks
	const buttons = document.querySelectorAll(".demo-button");
	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			e.preventDefault();
			const text = capitalize(button.textContent.toLowerCase());
			alert(`You clicked: ${text}`);
		});
	});

	// Add interactive class to cards
	const cards = document.querySelectorAll(".card");
	cards.forEach((card) => {
		card.addEventListener("mouseenter", () => {
			card.style.transform = "translateY(-4px)";
			card.style.transition = "transform 0.2s";
		});

		card.addEventListener("mouseleave", () => {
			card.style.transform = "translateY(0)";
		});
	});
});
