declare module 'react-native-mathjax' {
	interface MathJaxProps {
		mathJaxOptions?: {
			messageStyle: string;
			extensions: string[];
			jax: string[];
			tex2jax: {
				inlineMath: string[][];
				displayMath: string[][];
				processEscapes: boolean;
			};
			TeX: {
				extensions: string[];
			};
		};
		html?: string;
		[key: string]: any;
	}

	class MathJaxComponent extends React.Component<MathJaxProps> {}

	export default MathJaxComponent;
}
