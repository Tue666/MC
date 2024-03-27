import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tooltip from 'rn-tooltip';
import { ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../styles';
import { IRoom } from '../../types';
import { openModal } from '../../utils';
import { Avatar, Box, Rank } from '..';

const { MAIN_LAYOUT, ROOM, TOOLTIP } = ConstantConfig;

interface FormingItemProps {
	width: number;
	clientId: AccountState['profile']['_id'];
	roomOwner: IRoom.Room['owner'];
	client: IRoom.Room['clients'][number];
	onTransferForming: (newOwner: IRoom.Room['clients'][number]) => void;
	onRemoveFromForming: (client: IRoom.Room['clients'][number]) => void;
}

const FormingItem = (props: FormingItemProps) => {
	const { width, clientId, roomOwner, client, onTransferForming, onRemoveFromForming } = props;
	const isClient = clientId === client._id;
	const isClientOwner = roomOwner === clientId;
	const isRoomOwner = roomOwner === client._id;
	const isDisconnect = client.state === ROOM.CLIENT_STATE.disconnect;
	const theme = useTheme();
	const tooltipRef = useRef<Tooltip | null>(null);

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
					{
						width,
						backgroundColor: isDisconnect ? theme.colors.outline : globalStyles.paper.backgroundColor,
					},
				]}
			>
				<View>
					<View style={[stackStyles.center]}>
						<Avatar
							disconnected={client.state === 'DISCONNECT'}
							avatar={client.avatar}
							size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE}
						/>
					</View>
					<View style={[stackStyles.center]}>
						<View style={[stackStyles.row]}>
							{isRoomOwner && (
								<Icon
									name="star-rate"
									size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE / 4}
									color={theme.colors.tertiary}
									style={[styles.owner]}
								/>
							)}
							<Text variant="labelSmall" numberOfLines={1} style={[{ fontWeight: 'bold' }]}>
								{client.name}
							</Text>
						</View>
					</View>
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
	owner: {
		marginRight: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN / 2,
	},
});

export default FormingItem;
