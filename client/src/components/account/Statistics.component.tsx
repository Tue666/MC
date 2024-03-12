import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';
import { Box } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH =
	WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;

interface StatisticsProps {
	width?: number;
}

const Statistics = (props: StatisticsProps) => {
	const { width } = props;

	return (
		<View style={[stackStyles.rowWrap]}>
			{[...Array(5)].map((_, index) => {
				const itemWidth =
					(CONTAINER_WIDTH -
						(MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2) *
							2 *
							MAIN_LAYOUT.SCREENS.ACCOUNT.STATISTICS.NUMBER_ITEM_IN_ROW) *
					(1 / MAIN_LAYOUT.SCREENS.ACCOUNT.STATISTICS.NUMBER_ITEM_IN_ROW);

				return (
					<Box key={index} style={[styles.statistics, { width: width || itemWidth }]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							???
						</Text>
						<Text variant="labelSmall" style={[{ fontStyle: 'italic' }]}>
							Ngày ???
						</Text>
					</Box>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	statistics: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default Statistics;
