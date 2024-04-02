import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SegmentRenderProps } from '../Segment.component';
import { ConstantConfig } from '../../../configs';
import { stackStyles, typographyStyles } from '../../../styles';
import { Box } from '../..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;

interface StatisticsProps extends SegmentRenderProps {}

const Statistics = (props: StatisticsProps) => {
	const { label, width } = props;

	const CONTAINER_WIDTH =
		(width || WIDTH_SIZE) - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;
	const ITEM_WIDTH =
		(CONTAINER_WIDTH -
			(MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2) *
				2 *
				MAIN_LAYOUT.SCREENS.ACCOUNT.STATISTICS.NUMBER_ITEM_IN_ROW) *
		(1 / MAIN_LAYOUT.SCREENS.ACCOUNT.STATISTICS.NUMBER_ITEM_IN_ROW);

	return (
		<View>
			<Text variant="titleMedium" style={[typographyStyles.bold]}>
				{label}
			</Text>
			<View style={[stackStyles.rowWrap]}>
				{[...Array(5)].map((_, index) => {
					return (
						<Box key={index} style={[styles.statistics, { width: ITEM_WIDTH }]}>
							<Text variant="labelSmall" style={[typographyStyles.bold]}>
								???
							</Text>
							<Text variant="labelSmall" style={[typographyStyles.italic]}>
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
