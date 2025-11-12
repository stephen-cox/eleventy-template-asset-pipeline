---
layout: layout.njk
title: esbuild Example - Home
---

## Welcome to the esbuild Example

This example demonstrates the Eleventy Template Asset Pipeline plugin with esbuild - the fastest JavaScript bundler.

<div class="grid">
	<div class="card">
		<h3>⚡ Blazing Fast</h3>
		<p>esbuild is 10-100x faster than other bundlers. Perfect for large projects.</p>
	</div>

    <div class="card">
    	<h3>🎯 Simple Config</h3>
    	<p>Minimal configuration needed. Built-in TypeScript and JSX support.</p>
    </div>

    <div class="card">
    	<h3>🔒 Cache Busting</h3>
    	<p>Production builds include automatic cache busting with content hashing.</p>
    </div>

</div>

<div class="text-center mt-2">
	<h2>Interactive Counter</h2>
	<div class="counter-display" id="counter">0</div>
	<div>
		<button id="increment" class="btn">➕ Increment</button>
		<button id="decrement" class="btn">➖ Decrement</button>
		<button id="reset" class="btn">🔄 Reset</button>
	</div>
</div>

<div class="mt-2">
	<h2>Features Demonstrated</h2>
	<div>
		<span class="badge">ES Modules</span>
		<span class="badge">Class Components</span>
		<span class="badge">Tree Shaking</span>
		<span class="badge">Minification</span>
		<span class="badge">LocalStorage</span>
		<span class="badge">CSS Variables</span>
	</div>
</div>

<div class="mt-2">
	<h2>Try It Out</h2>
	<ul>
		<li>Click the counter buttons to see state management</li>
		<li>Toggle dark mode (persisted in localStorage)</li>
		<li>Hover over cards to see smooth animations</li>
		<li>Open DevTools to see bundled code</li>
		<li>Check the build info at the bottom</li>
	</ul>
</div>
