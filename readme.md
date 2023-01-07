# razorUX Eleventy Tools
[![CI](https://github.com/razorUX/razorux-eleventy-tools/actions/workflows/test.yml/badge.svg)](https://github.com/razorUX/razorux-eleventy-tools/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/razorux-eleventy-tools.svg)](https://badge.fury.io/js/razorux-eleventy-tools)

```
npm install razorux-eleventy-tools
```


## Included functions

```js
link // Sophisticated shortcode for creating HTML links
jsonEmbed // Embed JSON objects into your Elevety pages
envEmbed // Embed environment variables
youtubeEmbed // Embed YouTube videos
videoEmbed // Embed HTML5 video
imageEmbed // Embed optimized images
getEleventyImage // Generate 11ty images
fathomTrackClick // Track clicks with Fathom Analytics
formatDollars // Display prices in US dollars
```

## Installation

```
npm install razorux-eleventy-tools
```

Then, in `.eleventy.js` import the functions you want:

```js
const {
	jsonEmbed,
	envEmbed,
	youtubeEmbed,
	imageEmbed,
	videoEmbed,
	fathomTrackClick,
	link,
	formatDollars
} = require('razorux-eleventy-tools');
```

And then install the plugins you'd like:

```js
module.exports = function (eleventyConfig) {
	// ...
	
	eleventyConfig.addNunjucksShortcode("json",jsonEmbed);
	eleventyConfig.addNunjucksShortcode("env", envEmbed);
	eleventyConfig.addNunjucksShortcode("youtube",youtubeEmbed);
	eleventyConfig.addNunjucksAsyncShortcode("image", imageEmbed);
	eleventyConfig.addNunjucksAsyncShortcode("video", videoEmbed);
	eleventyConfig.addNunjucksShortcode("fathomTrackClick", fathomTrackClick);
	
	eleventyConfig.addPairedNunjucksShortcode("link", link()); // Note that `link` is a constructor where you can pass arguments
	
	// Adding an object of FathomIds, for example:
	eleventyConfig.addPairedNunjucksShortcode("link", link({
		fathomIds: {
			HeroCTA: "AHJKSWUABKA"
		}
		));
	// ...
}
```


## Thank You

Development sponsored by [razorUX](razorux.com)