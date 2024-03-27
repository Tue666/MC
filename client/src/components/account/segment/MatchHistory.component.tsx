import { StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { Segment } from '../Segment.component';
import { ConstantConfig } from '../../../configs';
import { stackStyles } from '../../../styles';
import { Avatar, Point, TouchableBox } from '../..';

const { MAIN_LAYOUT } = ConstantConfig;

interface MatchHistoryProps extends Pick<Segment, 'label'> {}

const MatchHistory = (props: MatchHistoryProps) => {
	const { label } = props;
	const theme = useTheme();

	return (
		<View>
			<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
				{label}
			</Text>
			<View>
				{[...Array(5)].map((_, index) => {
					return (
						<TouchableBox key={index} style={[styles.achievement]}>
							<Text variant="labelLarge" style={[{ fontWeight: 'bold', color: theme.colors.secondary }]}>
								CHIẾN THẮNG
							</Text>
							<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
								Đấu Nhanh
							</Text>
							<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
								Thời gian chơi: 00:02:00
							</Text>
							<Divider style={[{ marginVertical: 10 }]} />
							<View style={[stackStyles.rowWrap]}>
								{[...Array(2)].map((_, index) => {
									return (
										<View key={index} style={[stackStyles.row, { width: 100, margin: 5, justifyContent: 'center' }]}>
											<Point type="gold_point" size={MAIN_LAYOUT.HEADER.ICON_SIZE} />
											<Text variant="labelSmall" style={[{ fontWeight: 'bold', color: theme.colors.secondary }]}>
												{' '}
												+{index + 100}
											</Text>
										</View>
									);
								})}
							</View>
						</TouchableBox>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	achievement: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default MatchHistory;
