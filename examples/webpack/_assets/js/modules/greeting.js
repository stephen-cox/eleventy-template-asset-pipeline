/**
 * Greeting module
 * Provides greeting functionality
 */

/**
 * Generate a personalized greeting
 *
 * @param {string} name - The name to greet
 * @returns {string} The greeting message
 */
export function greet(name) {
	const hour = new Date().getHours();
	let timeOfDay;

	if (hour < 12) {
		timeOfDay = "morning";
	} else if (hour < 18) {
		timeOfDay = "afternoon";
	} else {
		timeOfDay = "evening";
	}

	return `Good ${timeOfDay}, ${name}!`;
}

/**
 * Generate a farewell message
 *
 * @param {string} name - The name to say goodbye to
 * @returns {string} The farewell message
 */
export function farewell(name) {
	return `Goodbye, ${name}! See you soon.`;
}
