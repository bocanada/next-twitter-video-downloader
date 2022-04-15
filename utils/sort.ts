import { Variants } from '../pages/api/video/[id]';

export const getMax = (videos: Variants[]) => {
	let filteredVideos = [...videos].filter((v) => v.res != "gif");
	if (!filteredVideos.length) {
		filteredVideos = videos;
	}
	return filteredVideos.reduce((prev, curr) => sortGifLast(prev, curr) === -1 ? prev : curr).url;
};

export const sortGifLast = (a: Variants, b: Variants) => {
	const x = Number.parseInt(a.res, 10);
	const y = Number.parseInt(b.res, 10);
	if (Number.isNaN(x)) {
		return -1;
	}
	if (Number.isNaN(y)) {
		return 1;
	}
	return x > y ? -1 : 1;
};