import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Segment } from '../Segment.component';
import { ConstantConfig } from '../../../configs';
import { stackStyles } from '../../../styles';
import { Box } from '../..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH =
	WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;
const ITEM_WIDTH =
	(CONTAINER_WIDTH -
		(MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2) *
			2 *
			MAIN_LAYOUT.SCREENS.ACCOUNT.STATISTICS.NUMBER_ITEM_IN_ROW) *
	(1 / MAIN_LAYOUT.SCREENS.ACCOUNT.STATISTICS.NUMBER_ITEM_IN_ROW);

interface StatisticsProps extends Pick<Segment, 'label'> {
	width?: number;
}

const Statistics = (props: StatisticsProps) => {
	const { label, width } = props;

	return (
		<View>
			<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
				{label}
			</Text>
			<View style={[stackStyles.rowWrap]}>
				{[...Array(5)].map((_, index) => {
					return (
						<Box key={index} style={[styles.statistics, { width: width || ITEM_WIDTH }]}>
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
