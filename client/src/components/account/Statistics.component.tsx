import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';
import { Box } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - 20;

const Statistics = () => {
	return (
		<View style={[stackStyles.rowWrap]}>
			{[...Array(5)].map((_, index) => {
				const statisticsWidth = (CONTAINER_WIDTH - 5 * 2 * 2) * 0.5;

				return (
					<Box key={index} style={[styles.statistics, { width: statisticsWidth }]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							1000
						</Text>
						<Text variant="labelSmall" style={[{ fontStyle: 'italic' }]}>
							Ngày Streack
						</Text>
					</Box>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	statistics: {
		padding: 10,
		margin: 5,
	},
});

export default Statistics;
