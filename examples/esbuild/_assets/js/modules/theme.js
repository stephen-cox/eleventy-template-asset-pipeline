/**
 * Theme switcher module - Light/Dark mode toggle
 */

export class ThemeSwitcher {
	constructor() {
		this.theme = localStorage.getItem("theme") || "light";
		this.apply();
	}

	toggle() {
		this.theme = this.theme === "light" ? "dark" : "light";
		this.apply();
		this.save();
	}

	apply() {
		document.documentElement.setAttribute("data-theme", this.theme);

		// Update button text
		const button = document.getElementById("theme-toggle");
		if (button) {
			button.textContent = this.theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
		}
	}

	save() {
		localStorage.setItem("theme", this.theme);
	}
}
