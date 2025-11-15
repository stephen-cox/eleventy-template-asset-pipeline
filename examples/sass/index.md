---
layout: layout.njk
title: Sass Example - Home
---

## Welcome to the Sass Example

This example demonstrates the Eleventy Template Asset Pipeline plugin with Sass/SCSS processing.

<div class="grid mt-2">
	<div class="card">
		<h3 class="card__title">Sass Processing</h3>
		<p class="card__content">
			SCSS is compiled to CSS with support for variables, nesting, mixins, and more.
		</p>
	</div>

    <div class="card card--featured">
    	<h3 class="card__title">Modern Features</h3>
    	<p class="card__content">
    		Uses modern @use syntax and modular architecture for maintainable stylesheets.
    	</p>
    </div>

    <div class="card">
    	<h3 class="card__title">Cache Busting</h3>
    	<p class="card__content">
    		Production builds include automatic cache busting with content hashing.
    	</p>
    </div>

</div>

<div class="text-center mt-2">
	<a href="#" class="btn">Primary Button</a>
	<a href="#" class="btn btn--secondary">Secondary Button</a>
	<a href="#" class="btn btn--outline">Outline Button</a>
</div>

<div class="mt-2">
	<div class="alert alert--info">
		<strong>Info:</strong> This is an informational alert styled with Sass.
	</div>

    <div class="alert alert--success">
    	<strong>Success:</strong> Your styles are compiled successfully!
    </div>

</div>

<div class="mt-2">
	<h2>Sass Features Demonstrated</h2>
	<ul>
		<li><span class="badge">Variables</span> - Color and spacing consistency</li>
		<li><span class="badge badge--success">Mixins</span> - Reusable style patterns</li>
		<li><span class="badge badge--warning">Nesting</span> - Organized component styles</li>
		<li><span class="badge badge--danger">Functions</span> - Dynamic style generation</li>
	</ul>
</div>
