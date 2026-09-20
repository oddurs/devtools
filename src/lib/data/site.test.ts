import { describe, expect, it } from 'vitest';
import { origin, url } from './site';

describe('url', () => {
	it('is absolute: the machines that read it have no page to be relative to', () => {
		expect(url('/quarry')).toMatch(/^https:\/\//);
	});

	it('gives the home page its trailing slash', () => {
		expect(url('/')).toBe(origin + __BASE_PATH__ + '/');
		expect(url()).toBe(url('/'));
	});

	it('hangs a route off the origin without doubling the slash', () => {
		expect(url('/quarry')).not.toContain('//quarry');
		expect(url('/quarry')).toBe(origin + __BASE_PATH__ + '/quarry');
	});

	it('works for a file in static/ as well as a route', () => {
		expect(url('/media/screens/quarry/01-hero.webp')).toBe(
			origin + __BASE_PATH__ + '/media/screens/quarry/01-hero.webp'
		);
	});

	it('names an origin with no trailing slash of its own to double up', () => {
		expect(origin).not.toMatch(/\/$/);
		expect(origin).toMatch(/^https:\/\/[^/]+$/);
	});
});
