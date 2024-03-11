import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { onCreateForming, onQuickJoinForming } from '../../screens/main/conquer/FindRoom.screen';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerFindRoomProps } from '../../types';

const { MAIN_LAYOUT } = ConstantConfig;

const FindRoomHeader = (props: ConquerFindRoomProps) => {
	const { route } = props;
	const { resource, roomMode, idleMode, maxCapacity } = route.params;
	const theme = useTheme();

	const onPressQuickJoinForming = () => {
		onQuickJoinForming({
			resource,
			roomMode,
		});
	};
	const onPressCreateForming = () => {
		onCreateForming({
			resource,
			roomMode,
			idleMode,
			maxCapacity,
		});
	};
	return (
		<View style={[styles.container, globalStyles.fw, stackStyles.row]}>
			<Text variant="titleMedium">Tìm phòng</Text>
			<View style={[stackStyles.row]}>
				<IconButton
					icon={() => (
						<Icon
							name="pageview"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.HEADER.ICON_SIZE}
							color={theme.colors.onSurface}
						/>
					)}
					onPress={onPressQuickJoinForming}
					style={[styles.icon]}
				/>
				<IconButton
					icon={() => (
						<Icon
							name="add"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.HEADER.ICON_SIZE}
							color={theme.colors.onSurface}
						/>
					)}
					onPress={onPressCreateForming}
					style={[styles.icon]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
	},
	icon: {
		marginLeft: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.MARGIN / 5,
	},
});

export default FindRoomHeader;
