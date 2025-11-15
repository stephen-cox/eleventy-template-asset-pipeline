/**
 * Counter module - Demonstrates class-based component
 */

export class Counter {
	constructor(element) {
		this.element = element;
		this.count = 0;
	}

	increment() {
		this.count++;
		this.render();
	}

	decrement() {
		this.count--;
		this.render();
	}

	reset() {
		this.count = 0;
		this.render();
	}

	render() {
		if (this.element) {
			this.element.textContent = this.count;

			// Add animation class
			this.element.classList.add("updated");
			setTimeout(() => {
				this.element.classList.remove("updated");
			}, 300);
		}
	}
}
