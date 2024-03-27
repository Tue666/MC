import { ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { Achievement, Box, MatchHistory, Statistics } from '..';
import { stackStyles } from '../../styles';

const { BUTTON, MAIN_LAYOUT } = ConstantConfig;

export interface Segment {
	label: string;
	icon: string;
	onRender: (label: string) => ReactNode;
}

const SEGMENTS: Segment[] = [
	{
		label: 'Thống kê',
		icon: 'analytics',
		onRender: (label: Segment['label']) => <Statistics label={label} />,
	},
	{
		label: 'Lịch sử đấu',
		icon: 'history-edu',
		onRender: (label: Segment['label']) => <MatchHistory label={label} />,
	},
	{
		label: 'Thành tựu',
		icon: 'emoji-events',
		onRender: (label: Segment['label']) => <Achievement label={label} />,
	},
];

const Segment = () => {
	const [segmentIndex, setSegmentIndex] = useState(0);
	const segment = SEGMENTS[segmentIndex];
	const theme = useTheme();

	const onChangeSegmentIndex = (newIndex: number) => {
		if (newIndex === segmentIndex) return;

		setSegmentIndex(newIndex);
	};
	return (
		<View>
			<Divider />
			<Box style={[styles.container]}>
				<View style={[stackStyles.row, stackStyles.center]}>
					{SEGMENTS.map((segment, index) => {
						const { icon } = segment;

						return (
							<TouchableOpacity key={index} onPress={() => onChangeSegmentIndex(index)} style={[styles.button]}>
								<Icon
									name={icon}
									color={segmentIndex === index ? theme.colors.primary : theme.colors.outline}
									size={BUTTON.ICON_SIZE * 1.5}
								/>
							</TouchableOpacity>
						);
					})}
				</View>
			</Box>
			<View style={[styles.segment]}>{segment.onRender(segment.label)}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderBottomLeftRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
		borderBottomRightRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
	},
	button: {
		flex: 1,
		alignItems: 'center',
	},
	segment: {
		marginTop: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
	},
});

export default Segment;
