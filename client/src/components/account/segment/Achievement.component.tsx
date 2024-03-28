import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SegmentRenderProps } from '../Segment.component';
import { ConstantConfig } from '../../../configs';
import { stackStyles } from '../../../styles';
import { Box } from '../..';

const { MAIN_LAYOUT } = ConstantConfig;

interface AchievementProps extends SegmentRenderProps {}

const Achievement = (props: AchievementProps) => {
	const { label } = props;
	const theme = useTheme();
	const achievements = [];

	return (
		<View>
			<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
				{label}
			</Text>
			{achievements.length > 0 && (
				<View>
					{[...Array(5)].map((_, index) => {
						return (
							<Box key={index} style={[styles.achievement]}>
								<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
									Huyền thoại ??
								</Text>
								<Text variant="labelSmall" numberOfLines={2} style={[{ fontStyle: 'italic' }]}>
									Chiến thắng liên tục 100 lần chế độ ???. Chiến thắng liên tục 100 lần chế độ ???. Chiến thắng liên
									tục 100 lần chế độ ???
								</Text>
							</Box>
						);
					})}
				</View>
			)}
			{achievements.length <= 0 && (
				<View style={[stackStyles.center]}>
					<Icon
						name="hotel-class"
						size={MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE}
						color={theme.colors.outline}
					/>
					<Text variant="titleMedium">Chưa có thành tựu nào</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	achievement: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default Achievement;
