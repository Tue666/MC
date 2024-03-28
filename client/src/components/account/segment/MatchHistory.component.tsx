import { Dimensions, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SegmentRenderProps } from '../Segment.component';
import { ConstantConfig } from '../../../configs';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { stackStyles } from '../../../styles';
import { ISchema } from '../../../types';
import { NumberUtil, openModal } from '../../../utils';
import { Point, TouchableBox } from '../..';

const { MAIN_LAYOUT, ROOM } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;

interface MatchHistoryProps extends SegmentRenderProps {}

const MatchHistory = (props: MatchHistoryProps) => {
	const { label, profile, width } = props;
	const theme = useTheme();
	const { resources } = useAppSelector(selectAccount);
	const CONTAINER_WIDTH =
		(width || WIDTH_SIZE) - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 6;
	const ITEM_WIDTH =
		(CONTAINER_WIDTH -
			(MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2) *
				2 *
				MAIN_LAYOUT.SCREENS.ACCOUNT.MATCH_HISTORY.NUMBER_ITEM_IN_ROW) *
		(1 / MAIN_LAYOUT.SCREENS.ACCOUNT.MATCH_HISTORY.NUMBER_ITEM_IN_ROW);

	const onPressViewMatch = (referenceId: string) => {
		openModal<'QUICK_MATCH_HISTORY'>({
			component: 'QUICK_MATCH_HISTORY',
			params: {
				_id: referenceId,
				profile,
				resources,
			},
		});
	};
	return (
		<View>
			<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
				{label}
			</Text>
			{profile.matches.length > 0 && (
				<View>
					{profile.matches.map((match) => {
						const { _id, resource, reference_id, playing_time, clients, created_at } = match;
						const client = clients.find((client) => client._id === profile._id);
						const isWinner = client && client.state === ROOM.CLIENT_STATE.win;
						const { hours, minutes, seconds } = NumberUtil.toTime(playing_time, ['H', 'M']);
						const time = `${hours && `${hours.text}:`}${minutes && `${minutes.text}:`}${seconds.text}`;

						return (
							<TouchableBox
								key={_id}
								style={[styles.match]}
								onPress={() => onPressViewMatch(reference_id)}
								soundName="button_click.mp3"
							>
								<Text
									variant="labelLarge"
									style={[{ fontWeight: 'bold', color: isWinner ? theme.colors.secondary : theme.colors.error }]}
								>
									{isWinner ? 'CHIẾN THẮNG' : 'THẤT BẠI'}
								</Text>
								<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
									{resources[resource].name}
								</Text>
								<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
									Thời gian chơi: {time}
								</Text>
								<View style={[{ alignSelf: 'flex-end' }]}>
									<Text variant="labelSmall" style={[{ fontStyle: 'italic' }]}>
										{created_at}
									</Text>
								</View>
								<Divider style={[{ marginVertical: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN }]} />
								{client && (
									<View style={[stackStyles.rowWrap]}>
										{Object.entries(client.point_differences).map(([point, value], index) => {
											const { changed } = value;

											return (
												<Point
													key={index}
													type={point as keyof ISchema.Point}
													value={changed}
													size={MAIN_LAYOUT.HEADER.ICON_SIZE}
													style={[
														{
															width: ITEM_WIDTH,
															margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
															justifyContent: 'center',
														},
													]}
												/>
											);
										})}
									</View>
								)}
							</TouchableBox>
						);
					})}
				</View>
			)}
			{profile.matches.length <= 0 && (
				<View style={[stackStyles.center]}>
					<Icon
						name="design-services"
						size={MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE}
						color={theme.colors.outline}
					/>
					<Text variant="titleMedium">Chưa có trận đấu nào</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	match: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default MatchHistory;
