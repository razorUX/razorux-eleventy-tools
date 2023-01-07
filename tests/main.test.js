const {
	jsonEmbed,
	envEmbed,
	youtubeEmbed,
	imageShortcode,
	getEleventyImage,
	fathomTrackClick,
	link,
	formatDollars
} = require('../src/main')


describe('loadEnvVars', () => {
	test('Should run with no errors', () => {
		expect(() =>{
			jsonEmbed({
				stolenBanana: true
			});
		}).not.toThrow();
	});
})
