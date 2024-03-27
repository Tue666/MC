import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { IRoom } from '../../types';
import { openDialog } from '../../utils';
import { Avatar, Box, Button } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface FormingBottomProps {
	isOwner: boolean;
	profile: AccountState['profile'];
	minToStart: IRoom.Room['minToStart'];
	clientCount: IRoom.Room['maxCapacity'];
	maxCapacity: IRoom.Room['maxCapacity'];
	onLeaveForming: () => void;
	onStart: () => void;
}

const FormingBottom = (props: FormingBottomProps) => {
	const { isOwner, profile, minToStart, clientCount, maxCapacity, onLeaveForming, onStart } = props;
	const theme = useTheme();

	const onPressStart = () => {
		if (clientCount < minToStart) {
			openDialog({
				title: '[Bắt đầu] Số lượng không hợp lệ',
				content: `Cần ít nhất ${minToStart} người để bắt đầu trận đấu`,
				actions: [{ label: 'Đồng ý' }],
			});
			return;
		}

		onStart();
	};
	const onPressChat = () => {};
	const onPressLeaveForming = () => {
		onLeaveForming();
	};
	return (
		<Box style={[styles.container, stackStyles.row]}>
			<View style={[styles.wrap, globalStyles.container, globalStyles.fh, stackStyles.center]}>
				<Avatar avatar={profile.avatar} size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.BOTTOM.ICON_SIZE} />
				<View style={[stackStyles.row]}>
					{isOwner && (
						<Icon
							name="star-rate"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE / 4}
							color={theme.colors.tertiary}
							style={[styles.owner]}
						/>
					)}
					<Text variant="labelSmall" numberOfLines={1} style={[{ fontWeight: 'bold' }]}>
						{profile.name}
					</Text>
				</View>
			</View>
			<View style={[styles.wrap, globalStyles.container, globalStyles.fh, stackStyles.center]}>
				<Text
					variant="titleSmall"
					numberOfLines={1}
					style={[typographyStyles.center, { fontWeight: 'bold' }]}
				>
					Đấu Nhanh
				</Text>
				<Text variant="headlineLarge" style={[{ fontWeight: 'bold' }]}>
					{clientCount}/{maxCapacity}
				</Text>
				<View style={[styles.action, globalStyles.fw]}>
					{isOwner && (
						<Button mode="contained" onPress={onPressStart} soundName="button_click.mp3">
							Bắt đầu
						</Button>
					)}
					<Button disabled mode="contained" onPress={onPressChat} soundName="button_click.mp3">
						Trò chuyện
					</Button>
					<Button
						mode="contained"
						buttonColor={theme.colors.error}
						textColor={theme.colors.onError}
						onPress={onPressLeaveForming}
						soundName="button_click.mp3"
					>
						Rời phòng
					</Button>
				</View>
			</View>
		</Box>
	);
};

const styles = StyleSheet.create({
	container: {
		height: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.BOTTOM.HEIGHT,
		marginVertical: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN,
		justifyContent: 'space-between',
	},
	wrap: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.PADDING / 5,
	},
	action: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.PADDING,
	},
	owner: {
		marginRight: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN / 2,
	},
});

export default FormingBottom;
