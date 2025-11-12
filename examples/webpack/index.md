---
layout: layout.njk
title: Webpack Example - Home
---

## Welcome to the Webpack Example

<div class="text-center">
	<p id="greeting">Loading...</p>
	<p id="current-date"></p>
</div>

This example demonstrates the Eleventy Template Asset Pipeline plugin with Webpack bundling.

<div class="grid">
	<div class="card">
		<h3>Webpack 5</h3>
		<p>JavaScript is bundled with Webpack 5 and transpiled with Babel for broad browser support.</p>
	</div>

    <div class="card">
    	<h3>ES6 Modules</h3>
    	<p>Use modern ES6 import/export syntax. Webpack handles the bundling automatically.</p>
    </div>

    <div class="card">
    	<h3>Cache Busting</h3>
    	<p>Production builds include automatic cache busting with content hashing.</p>
    </div>

</div>

<div class="text-center mt-2">
	<button class="btn demo-button">Click Me</button>
	<button class="btn demo-button">Try This</button>
	<button class="btn demo-button">And This</button>
</div>

<div class="mt-2">
	<h2>Interactive Features</h2>
	<ul>
		<li>Hover over the cards above to see the animation effect</li>
		<li>Click the buttons to see JavaScript interaction</li>
		<li>Check the console for initialization messages</li>
		<li>View page source to see cache-busted filenames in production</li>
	</ul>
</div>
