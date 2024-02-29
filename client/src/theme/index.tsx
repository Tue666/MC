import { PropsWithChildren } from 'react';
import { PaperProvider } from 'react-native-paper';
import {
	GlobalStylesConfiguration,
	StackStylesConfiguration,
	TypographyStylesConfiguration,
} from '../styles';
import { useSetting } from '../hooks';
import { scheme } from './scheme';

const ThemeProvider = (props: PropsWithChildren) => {
	const { children } = props;
	const { themeMode } = useSetting();
	const theme = themeMode === 'light' ? scheme.light : scheme.dark;

	return (
		<PaperProvider theme={theme}>
			<GlobalStylesConfiguration />
			<StackStylesConfiguration />
			<TypographyStylesConfiguration />
			{children}
		</PaperProvider>
	);
};

export default ThemeProvider;
