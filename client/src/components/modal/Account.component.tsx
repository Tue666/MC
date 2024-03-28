import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { AccountAPI } from '../../apis';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { AVATAR_SIZE } from '../../screens/main/account/Account.screen';
import { globalStyles } from '../../styles';
import { IAccount } from '../../types';
import { closeModal, openDialog } from '../../utils';
import { Avatar, Cover, Information, Loading, Segment } from '..';

const { MAIN_LAYOUT, MODAL } = ConstantConfig;
const CONTAINER_WIDTH = MODAL.ACCOUNT.WIDTH - MODAL.ACCOUNT.PADDING * 2;

export interface AccountProps {
	_id: IAccount.Account['_id'];
}

const Account = (props: AccountProps) => {
	const { _id } = props;
	const [profile, setProfile] = useState<AccountState['profile'] | null>(null);
	const theme = useTheme();

	useEffect(() => {
		const getProfile = async () => {
			try {
				const { profile, error } = await AccountAPI.getProfile(_id);
				if (error) {
					closeModal();
					openDialog({
						title: '[Xem thông tin] Lỗi',
						content: error,
						actions: [{ label: 'Đồng ý' }],
					});
					return;
				}

				setProfile(profile);
			} catch (error) {
				openDialog({
					title: '[Xem thông tin] Lỗi',
					content: `${(error as AxiosError).response?.data}`,
				});
			}
		};

		getProfile();
	}, [_id]);
	const onPressCloseModal = () => {
		SoundManager.playSound('button_click.mp3');
		closeModal();
	};
	return (
		<View style={[styles.container, globalStyles.bg, globalStyles.shadow]}>
			<Icon
				name="close"
				size={MODAL.ICON_SIZE}
				color={theme.colors.onSurface}
				onPress={onPressCloseModal}
				style={[styles.close]}
			/>
			{!profile && <Loading />}
			{profile && (
				<ScrollView>
					<View>
						<Cover cover={profile.cover} style={[{ height: MODAL.ACCOUNT.COVER_HEIGHT }]} />
						<Avatar
							noRank
							avatar={profile.avatar}
							size={MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE}
							style={[styles.avatar]}
						/>
						<Information
							name={profile.name}
							experience_point={profile.experience_point}
							created_at={profile.created_at}
						/>
					</View>
					<Segment profile={profile} width={MODAL.ACCOUNT.WIDTH} />
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width: MODAL.ACCOUNT.WIDTH,
		height: MODAL.ACCOUNT.HEIGHT,
		padding: MODAL.ACCOUNT.PADDING,
		borderRadius: MODAL.ACCOUNT.BORDER_RADIUS,
	},
	close: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 9999,
	},
	avatar: {
		position: 'absolute',
		top: MODAL.ACCOUNT.COVER_HEIGHT - MODAL.ACCOUNT.PADDING * 2 - AVATAR_SIZE / 2,
		left: CONTAINER_WIDTH / 2 - AVATAR_SIZE / 2,
		zIndex: 9999,
	},
});

export default Account;
