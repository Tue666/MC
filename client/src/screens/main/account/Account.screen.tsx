import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Achievement, Avatar, Cover, Information, Statistics } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { AccountProps } from '../../../types';

const { CIRCLE_BORDER, MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

export const AVATAR_SIZE =
	MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE +
	CIRCLE_BORDER.PADDING * 2 +
	CIRCLE_BORDER.BORDER_WIDTH * 2;

const Account = (props: AccountProps) => {
	const { navigation } = props;
	const theme = useTheme();
	const { profile } = useAppSelector(selectAccount);

	const onPressSetting = () => {
		navigation.navigate('Setting');
	};
	return (
		<ScrollView>
			<View>
				<Icon
					name="settings"
					size={MAIN_LAYOUT.SCREENS.ACCOUNT.SETTING.ICON_SIZE}
					color={theme.colors.onPrimary}
					onPress={onPressSetting}
					style={[styles.setting]}
				/>
				<Cover />
				<Avatar
					size={MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE}
					avatar={profile.avatar}
					style={[styles.avatar]}
				/>
				<Information name={profile.name} created_at={profile.created_at} />
			</View>
			<View style={[styles.space]}>
				<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
					Thống kê
				</Text>
				<Statistics />
			</View>
			<View style={[styles.space]}>
				<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
					Thành tựu
				</Text>
				<Achievement />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	setting: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 9999,
	},
	avatar: {
		position: 'absolute',
		top: MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.COVER_HEIGHT - AVATAR_SIZE / 2,
		left: CONTAINER_WIDTH / 2 - AVATAR_SIZE / 2,
		zIndex: 9999,
	},
	space: {
		marginTop: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN * 2,
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
	},
});

export default Account;
