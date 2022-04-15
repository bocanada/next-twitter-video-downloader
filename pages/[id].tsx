import type { GetServerSideProps, NextPage } from 'next';
import { getVideos } from '../utils/getVideos';
import { Layout } from '../components/Layout';
import VideoCard, { VideoInfo } from '../components/VideoCard';
import { sortGifLast } from '../utils/sort';

type Props = {
	videoUrl: string;
	description: string;
	id: string;
};

export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=60, stale-while-revalidate=59'
	);
	const { id } = query;
	const response = await getVideos(id as string);
	try {
		// First try filtering gifs, if after filtering all gifs there are no videos, reduce on all videos
		const url = (response.videos.filter((v) => v.res != "gif") || response.videos)
			.reduce((prev, curr) => sortGifLast(prev, curr) === -1 ? prev : curr).url;
		return {
			props: {
				URL: url,
				description: response.text,
				thumb: response.thumbnail,
				all: response.videos,
				id: id,
			},
		};
	} catch {
		throw new Error(`Couldn't fetch any video with id ${id}`);
	};
};


const Test: NextPage<VideoInfo> = (props) => {
	return (
		<Layout title={`Video from tweet: ${props.id}`} description={props.description} ogImageURL={props.thumb}>
			<VideoCard {...props} />
		</Layout >
	);
};


export default Test;;;;;