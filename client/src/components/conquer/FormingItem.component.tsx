import { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tooltip from 'rn-tooltip';
import { ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../styles';
import { IRoom } from '../../types';
import { openModal } from '../../utils';
import { Avatar, Box, Rank } from '..';

const { CIRCLE_BORDER, MAIN_LAYOUT, ROOM, TOOLTIP } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH =
	WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;
const AVATAR_SIZE =
	MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE +
	CIRCLE_BORDER.PADDING * 2 +
	CIRCLE_BORDER.BORDER_WIDTH * 2;

interface FormingItemProps {
	clientId: AccountState['profile']['_id'];
	roomOwner: IRoom.Room['owner'];
	client: IRoom.Room['clients'][number];
	onTransferForming: (newOwner: IRoom.Room['clients'][number]) => void;
	onRemoveFromForming: (client: IRoom.Room['clients'][number]) => void;
}

const FormingItem = (props: FormingItemProps) => {
	const { clientId, roomOwner, client, onTransferForming, onRemoveFromForming } = props;
	const isClient = clientId === client._id;
	const isClientOwner = roomOwner === clientId;
	const isRoomOwner = roomOwner === client._id;
	const isDisconnect = client.state === ROOM.CLIENT_STATE.disconnect;
	const theme = useTheme();
	const tooltipRef = useRef<Tooltip | null>(null);
	const itemWidth =
		(CONTAINER_WIDTH - 5 * 2 * MAIN_LAYOUT.SCREENS.CONQUER.FORMING.NUMBER_ITEM_IN_ROW) *
		(1 / MAIN_LAYOUT.SCREENS.CONQUER.FORMING.NUMBER_ITEM_IN_ROW);

	useEffect(() => {
		return () => {
			tooltipRef.current = null;
		};
	}, []);
	const closeTooltip = () => {
		tooltipRef?.current?.toggleTooltip();
	};
	const onPressView = () => {
		closeTooltip();

		openModal<'ACCOUNT'>({
			component: 'ACCOUNT',
			params: {
				_id: client._id,
			},
		});
	};
	const onPressTransferOwner = () => {
		closeTooltip();

		onTransferForming(client);
	};
	const onPressKick = () => {
		closeTooltip();

		onRemoveFromForming(client);
	};
	return (
		<Tooltip
			ref={tooltipRef}
			actionType="press"
			pointerColor={globalStyles.paper.backgroundColor}
			containerStyle={{
				...globalStyles.paper,
				...globalStyles.shadow,
				paddingHorizontal: 80,
				paddingVertical: 30,
			}}
			popover={
				<View style={[stackStyles.row]}>
					<IconButton
						mode="contained"
						containerColor={theme.colors.primary}
						icon={() => <Icon name="search" size={TOOLTIP.ICON_SIZE} color={theme.colors.onPrimary} />}
						onPress={onPressView}
					/>
					{isClientOwner && !isClient && (
						<>
							<IconButton
								mode="contained"
								containerColor={theme.colors.primary}
								icon={() => <Icon name="hotel-class" size={TOOLTIP.ICON_SIZE} color={theme.colors.onPrimary} />}
								onPress={onPressTransferOwner}
							/>
							<IconButton
								mode="contained"
								containerColor={theme.colors.error}
								icon={() => <Icon name="logout" size={TOOLTIP.ICON_SIZE} color={theme.colors.onError} />}
								onPress={onPressKick}
							/>
						</>
					)}
				</View>
			}
		>
			<Box
				style={[
					styles.container,
					stackStyles.row,
					{
						width: itemWidth,
						backgroundColor: isDisconnect ? theme.colors.outline : globalStyles.paper.backgroundColor,
					},
				]}
			>
				<View style={[{ position: 'relative' }]}>
					{isRoomOwner && (
						<Icon
							name="star-rate"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE / 2}
							color={theme.colors.tertiary}
							style={[
								styles.owner,
								{ right: AVATAR_SIZE / 2 - MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE / 4 },
							]}
						/>
					)}
					<Avatar
						avatar={client.avatar}
						size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE}
						innerStyle={[{ marginTop: 0 }]}
					/>
				</View>
				<View style={[styles.detail, stackStyles.center]}>
					<Text variant="labelSmall" numberOfLines={1} style={[{ fontWeight: 'bold' }]}>
						{client.name}
					</Text>
					{isDisconnect && (
						<Text variant="labelSmall" numberOfLines={1}>
							Mất kết nối
						</Text>
					)}
					{!isDisconnect && <Rank size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE} />}
				</View>
			</Box>
		</Tooltip>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.PADDING,
		margin: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN / 2,
	},
	detail: {
		flex: 1,
		marginLeft: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN,
	},
	owner: {
		position: 'absolute',
		bottom: '100%',
	},
});

export default FormingItem;
