import { Canvas, Circle, Group } from '@shopify/react-native-skia';

const CountdownCircle = () => {
	const r = 128;
	return (
		<Canvas style={{ flex: 1 }}>
			<Circle cx={r} cy={r} r={r} color="aqua" />
			{/* The paint is inherited by the following sibling and descendants. */}
			<Group style="stroke" strokeWidth={10} color="yellow">
				<Circle cx={r} cy={r} r={r / 2} />
				<Circle cx={r} cy={r} r={r / 3} />
			</Group>
		</Canvas>
	);
};

export default CountdownCircle;
