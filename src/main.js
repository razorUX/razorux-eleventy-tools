const Image = require("@11ty/eleventy-img");

function jsonEmbed(obj) {
	return JSON.stringify(obj);
}

function envEmbed(varName) {
	const value =  process.env[varName];
	return value || `Unable to find env var ${varName}`;
}


function youtubeEmbed(id, options) {
	// Build the string, using config data as we go
	// unique ID based on youtube video id

	options.allowFullscreen = true;
	options.noCookie = true;
	options.lazy = true;
	options.enableSuggestedVideos = false;
	options.title = options.title || "Embedded YouTube video";

	let out =
		'<div id="' + id + '" ';
	// global class name for all embeds, use this for styling
	out += 'class="' + options.embedClass + '"';
	// intrinsic aspect ratio; currently hard-coded to 16:9
	// TODO: make configurable somehow
	out += 'style="position:relative;width:100%;padding-top: 56.25%;">';
	out +=
		'<iframe style="position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;" ';
	out += 'width="100%" height="100%" frameborder="0" title="Embedded YouTube video" ';
	out += 'src="https://www.';
	// default to nocookie domain
	out += options.noCookie ? "youtube-nocookie" : "youtube";
	out += '.com/embed/';
	out += id;
	// autoplay is _technically_ possible, but be cool, don't do this
	out += options.allowAutoplay ? '?autoplay=1' : '';
	out += '" ';
	// configurable allow attributes
	out += 'allow="' + options.allowAttrs + '"';
	// configurable fullscreen capability
	out += options.allowFullscreen ? ' allowfullscreen' : '';
	//configurable iframe lazy-loading
	out += options.lazy ? ' loading="lazy"' : '';
	out += options.enableSuggestedVideos ? '' : 'rel=0';
	out += '></iframe></div>';
	return out;
}


async function imageEmbed({src, alt, widths, cssSizes, cssClass = "", style = "", hasTransparency = false, attributes = {}, remote = false}) {
	if(src === undefined) return "";

	const formats = hasTransparency ? ['avif', 'webp', 'png' ] : ['avif', 'webp', 'jpg', ]

	const imageUrl = remote ? src : '.' + src;

	let metadata = await Image(imageUrl, {
		formats,
		widths,
		urlPath: "/img/generated/",
		outputDir: "./_site/img/generated/",
	});


	let imageAttributes = {
		alt,
		class: cssClass || "",
		style: style || "",
		sizes: cssSizes,
		loading: "lazy",
		decoding: "async",
		...attributes,
	};

	const pictureElementHtml = Image.generateHTML(metadata, imageAttributes);

	return pictureElementHtml;
}

async function getEleventyImage({src, alt, widths, cssSizes, hasTransparency = false, attributes = {}}) {
	if(src === undefined) return "";

	const formats = hasTransparency ? ['avif', 'webp', 'png' ] : ['avif', 'webp', 'jpg', ]

	return await Image('.' + src, {
		formats,
		widths,
		urlPath: "/img/generated/",
		outputDir: "./_site/img/generated/",
	});
}


function fathomTrackClick(eventId) {
	return `onclick="window?.fathom?.trackGoal('${eventId}', 0);"`;
}

function link(content, { url, label = "", ariaLabel = "", cssClasses = "", inlineStyles = "", attributes = "", openInNewTab = false, download = false, protectFromScrapers = false, fathomClickId }) {
	
	const fathomIds = process.env.FATHOM_IDS;
	if(fathomClickId && !fathomIds) console.error(`Unable to add Fathom click event ${fathomClickId} as the FATHOM_IDS env var is empty.`)
	
	const fathomClickHandler = fathomClickId ? `onclick="window?.fathom?.trackGoal('${fathomIds[fathomClickId]}', 0);"` : '';
	const openInNewTabAttribute = openInNewTab ? "target='_blank' noopener" : "";
	const ariaLabelAttribute = ariaLabel ? `aria-label="${ariaLabel}"` : '';
	const styleAttribute = inlineStyles ? `style="${inlineStyles}"`: "";
	const downloadAttribute = download ? 'download' : '';
	
	// const protectFromScrapers = "";
	
	return `
		<a href="${url}" class="${cssClasses}" ${styleAttribute} ${ariaLabelAttribute} ${openInNewTabAttribute} ${downloadAttribute} ${attributes} ${fathomClickHandler}>
			${label}
			${content}
		</a>
	`;
}

function formatDollars(n) {
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});
	return formatter.format(n)
}


const isDefined = (o) => !(!o);

const VIDEO_EVENTS = 'audioprocess canplay canplaythrough complete durationchange emptied ended error loadeddata loadedmetadata pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting'.split(' ');

function videoEmbed({
		src,
		mp4Src,
		webmSrc,
		posterSrc, // Becomes `poster`
		id,
		height,
		width,
		cssClasses,
		styles,
		playsinline = false,
		autoplay = false,
		muted = true,
		loop = false,
		controls = true,
		controlslist = '', // nodownload | nofullscreen | noremoteplayback
		crossorigin = 'anonymous', // anonymous | use-credentials
		autopictureinpicture = false,
		disablepictureinpicture = false,
		disableremoteplayback = false,
		preload = 'auto', // none | metadata | auto
		listeners = [],
		attrInject = ""
	}) {

	 const idStr = id ? `id="${id}"` : "";
	 const srcAttr = src ? `src="${src}"` : '';
	 const webM = webmSrc ? `<source src="${webmSrc}" type="video/webm">` : '';
	 const mp4 = mp4Src ? `<source src="${mp4Src}" type="video/mp4">` : '';
	 const poster = posterSrc ? `poster="${posterSrc}"` : '';
	 const cssString = cssClasses ? `class="${cssClasses}"` : '';
	 const webkitAirplayDisabled = disableremoteplayback ? `x-webkit-airplay="deny"` : '';
	 const loopFn = loop ? "onended='function(){  this.load(); this.play();}'" : "";

	 const simpleAttrs = {
		 muted,
		 loop,
		 controls,
		 playsinline,
		 autoplay,
		 autopictureinpicture,
		 disablepictureinpicture,
		 disableremoteplayback
	 }

	 const attrString = Object.entries(simpleAttrs).map(([key, value]) => {
		 if(value) return key;
	 }).filter(isDefined).join(' ');

	 console.log(attrString);

	return `
		<video ${idStr} ${srcAttr} ${poster} ${attrString} ${loopFn} ${webkitAirplayDisabled} ${cssString} ${attrInject}>
			${webM}
			${mp4}
		</video>
	`
}

exports.jsonEmbed = jsonEmbed;
exports.envEmbed = envEmbed;
exports.youtubeEmbed = youtubeEmbed;
exports.videoEmbed = videoEmbed;
exports.imageEmbed = imageEmbed;
exports.getEleventyImage = getEleventyImage;
exports.fathomTrackClick = fathomTrackClick;
exports.link = link;
exports.formatDollars = formatDollars;
