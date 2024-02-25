import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../configs';

const { CIRCLE_BORDER } = ConstantConfig;

export interface CircleBorderProps extends PropsWithChildren {
	label?: string;
}

const CircleBorder = (props: CircleBorderProps) => {
	const { children, label } = props;
	const theme = useTheme();

	return (
		<View style={{ ...styles.container }}>
			<View style={{ ...styles.border, borderColor: theme.colors.primary }}>{children}</View>
			{label && <Text style={{ ...styles.label }}>{label}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: CIRCLE_BORDER.MARGIN_VERTICAL,
		alignItems: 'center',
	},
	border: {
		borderRadius: 99999,
		padding: CIRCLE_BORDER.PADDING,
		borderWidth: CIRCLE_BORDER.BORDER_WIDTH,
	},
	label: {
		marginTop: 10,
		fontWeight: 'bold',
	},
});

export default CircleBorder;
