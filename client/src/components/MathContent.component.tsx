import { ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import MathJax from 'react-native-mathjax';
import { ConstantConfig } from '../configs';

const { MATHJAX } = ConstantConfig;

const mathJaxOptions = {
	messageStyle: 'none',
	extensions: ['tex2jax.js'],
	jax: ['input/TeX', 'output/HTML-CSS'],
	tex2jax: {
		inlineMath: [
			['$', '$'],
			['\\(', '\\)'],
		],
		displayMath: [
			['$$', '$$'],
			['\\[', '\\]'],
		],
		processEscapes: true,
	},
	TeX: {
		extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'],
	},
};

const mathjaxWrapperRender = (content: string, textColor: string) => {
	return `
		<div style="color: ${textColor}; font-size: ${MATHJAX.FONT_SIZE};">
			${content}
		</div>
	`;
};

interface MathContentProps {
	content: string;
	style?: ViewProps['style'];
	textColor?: string;
}

const MathContent = (props: MathContentProps) => {
	const { content, style, textColor } = props;
	const theme = useTheme();

	return (
		<MathJax
			mathJaxOptions={mathJaxOptions}
			html={mathjaxWrapperRender(content, textColor || theme.colors.onSurface)}
			style={style}
		/>
	);
};

export default MathContent;
