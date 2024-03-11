import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles } from '../../styles';
import { IRoom } from '../../types';
import { Avatar, Rank, TouchableBox } from '..';

const { MAIN_LAYOUT, ROOM } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH =
	WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;

interface FormingItemProps {
	owner: IRoom.Room['owner'];
	client: IRoom.Room['clients'][number];
}

const FormingItem = (props: FormingItemProps) => {
	const { owner, client } = props;
	const isOwner = owner === client._id;
	const isDisconnect = client.state === ROOM.CLIENT_STATE.disconnect;
	const theme = useTheme();
	const accountWidth = (CONTAINER_WIDTH - 5 * 2 * 2) * 0.5;

	return (
		<TouchableBox
			style={[
				styles.container,
				stackStyles.row,
				{
					width: accountWidth,
					backgroundColor: isDisconnect ? theme.colors.outline : globalStyles.paper.backgroundColor,
				},
			]}
		>
			<Avatar
				avatar={client.avatar}
				size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE}
				innerStyle={[{ marginTop: 0 }]}
			/>
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
		</TouchableBox>
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
});

export default FormingItem;
