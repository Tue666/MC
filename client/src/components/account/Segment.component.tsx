import { ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { stackStyles } from '../../styles';
import { Achievement, Box, MatchHistory, Statistics } from '..';

const { BUTTON, MAIN_LAYOUT } = ConstantConfig;

export interface SegmentRenderProps extends SegmentProps, Pick<Segment, 'label'> {}

export interface Segment {
	label: string;
	icon: string;
	onRender: (props: SegmentRenderProps) => ReactNode;
}

const SEGMENTS: Segment[] = [
	{
		label: 'Thống kê',
		icon: 'analytics',
		onRender: (props: SegmentRenderProps) => <Statistics {...props} />,
	},
	{
		label: 'Lịch sử đấu',
		icon: 'history-edu',
		onRender: (props: SegmentRenderProps) => <MatchHistory {...props} />,
	},
	{
		label: 'Thành tựu',
		icon: 'emoji-events',
		onRender: (props: SegmentRenderProps) => <Achievement {...props} />,
	},
];

interface SegmentProps {
	width?: number;
	profile: AccountState['profile'];
}

const Segment = (props: SegmentProps) => {
	const { width, profile } = props;
	const [segmentIndex, setSegmentIndex] = useState(0);
	const segment = SEGMENTS[segmentIndex];
	const theme = useTheme();

	const onChangeSegmentIndex = (newIndex: number) => {
		if (newIndex === segmentIndex) return;

		SoundManager.playSound('button_click.mp3');
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
			<View style={[styles.segment]}>
				{segment.onRender({
					label: segment.label,
					profile,
					width,
				})}
			</View>
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
