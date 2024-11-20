import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import {mdsvex} from 'mdsvex';

// @type {import('mdsvex').MdsvexOptions}
const mdsvexOptions = {
	extensions: ['.md'],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}

	// kit: {
	// 	// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
	// 	// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
	// 	// See https://svelte.dev/docs/kit/adapters for more information about adapters.
	// 	adapter: adapter({
	// 		// default options are shown. On some platforms
	// 		// these options are set automatically — see below
	// 		pages: 'build',
	// 		assets: 'build',
	// 		fallback: undefined,
	// 		precompress: false,
	// 		strict: true
	// 	})
	// }
};

export default config;
