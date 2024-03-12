import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { IRoom } from '../../types';
import { openDialog } from '../../utils';
import { Avatar, Box, Button, Rank } from '..';

const { CIRCLE_BORDER, MAIN_LAYOUT } = ConstantConfig;

const AVATAR_SIZE =
	MAIN_LAYOUT.SCREENS.CONQUER.FORMING.BOTTOM.ICON_SIZE +
	CIRCLE_BORDER.PADDING * 2 +
	CIRCLE_BORDER.BORDER_WIDTH * 2 +
	MAIN_LAYOUT.SCREENS.CONQUER.FORMING.PADDING / 2;

interface FormingBottomProps {
	isOwner: boolean;
	profile: AccountState['profile'];
	clientCount: IRoom.Room['maxCapacity'];
	maxCapacity: IRoom.Room['maxCapacity'];
	minCapacityToStart: IRoom.Room['maxCapacity'];
	onLeaveForming: () => void;
	onStart: () => void;
}

const FormingBottom = (props: FormingBottomProps) => {
	const { isOwner, profile, clientCount, maxCapacity, minCapacityToStart, onLeaveForming, onStart } =
		props;
	const theme = useTheme();

	const onPressStart = () => {
		if (clientCount < minCapacityToStart) {
			openDialog({
				title: '[Bắt đầu] Số lượng không hợp lệ',
				content: `Cần ít nhất ${minCapacityToStart} người để bắt đầu trận đấu`,
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
				<View style={[{ position: 'relative' }]}>
					{isOwner && (
						<Icon
							name="star-rate"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE}
							color={theme.colors.tertiary}
							style={[
								styles.owner,
								{ right: AVATAR_SIZE / 2 - MAIN_LAYOUT.SCREENS.CONQUER.FORMING.ITEM.ICON_SIZE / 2 },
							]}
						/>
					)}
					<Avatar
						label={profile.name}
						avatar={profile.avatar}
						size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.BOTTOM.ICON_SIZE}
						innerStyle={[{ marginTop: 0 }]}
					/>
				</View>
				<Rank size={MAIN_LAYOUT.SCREENS.CONQUER.FORMING.BOTTOM.ICON_SIZE} />
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
		position: 'absolute',
		bottom: '100%',
	},
});

export default FormingBottom;
