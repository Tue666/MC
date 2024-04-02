import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { IRoom } from '../../types';
import { Avatar, Name, TouchableBox } from '..';

const MAX_VISIBLE_MEMBER_NUMBER = 5;
const { MAIN_LAYOUT } = ConstantConfig;

interface FindRoomItemProps {
	room: IRoom.Room;
	onJoinForming: (room: IRoom.Room) => void;
}

const FindRoomItem = (props: FindRoomItemProps) => {
	const { room, onJoinForming } = props;
	const { name, description, password, owner, maxCapacity, clients } = room;
	const roomOwner = clients.find((client) => client._id === owner);
	const roomMembers = clients.filter((client) => client._id !== owner);

	const onPressJoinForming = () => {
		onJoinForming(room);
	};
	return (
		<TouchableBox
			onPress={onPressJoinForming}
			style={[styles.container, globalStyles.fw, stackStyles.row]}
		>
			<Avatar avatar={roomOwner?.avatar} size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.ITEM.ICON_SIZE} />
			<View style={[styles.detail]}>
				<Text variant="labelSmall" numberOfLines={1} style={[typographyStyles.bold]}>
					{password ? `🔒 ${name}` : name} ({clients.length}/{maxCapacity})
				</Text>
				<Name>{roomOwner?.name}</Name>
				<Text variant="labelSmall" numberOfLines={1} style={[typographyStyles.italic]}>
					{description}
				</Text>
				<View style={[stackStyles.row]}>
					{roomMembers.splice(0, MAX_VISIBLE_MEMBER_NUMBER).map((member, index) => {
						return (
							<Avatar
								key={index}
								avatar={member.avatar}
								size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.ITEM.SUB_ICON_SIZE}
								style={[{ margin: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.MARGIN / 5 }]}
							/>
						);
					})}
					{roomMembers.length > 0 && <Text variant="labelMedium"> +{roomMembers.length}</Text>}
				</View>
			</View>
		</TouchableBox>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.PADDING,
		margin: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.MARGIN / 2,
	},
	detail: {
		flex: 1,
		marginLeft: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.MARGIN,
	},
});

export default FindRoomItem;
