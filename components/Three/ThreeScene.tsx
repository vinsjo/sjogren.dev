import { Canvas } from '@react-three/fiber';
import { isFn } from 'x-is-type';
import FrameLimiter from './FrameLimiter';
import styles from './ThreeScene.module.css';

const ThreeScene = ({
	onLoad = null,
	fpsLimit = 0,
	screenCover = 1,
	gl = { antialias: false, alpha: true, powerPreference: 'low-power' },
	...props
}) => {
	return (
		<Canvas
			className={styles.canvas}
			onCreated={(state) => isFn(onLoad) && onLoad(state)}
			gl={gl}
			{...props}
		>
			<FrameLimiter fps={fpsLimit} />
			{props.children}
		</Canvas>
	);
};

export default ThreeScene;
