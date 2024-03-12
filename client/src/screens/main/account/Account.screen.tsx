import { ReactNode } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tooltip from 'rn-tooltip';
import { Asset } from 'react-native-image-picker';
import { Achievement, Avatar, Button, Cover, Information, Statistics } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useImagePicker } from '../../../hooks';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAccount, updateAvatar, updateCover } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { openDialog } from '../../../utils';
import { AccountProps } from '../../../types';

const { CIRCLE_BORDER, MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

export const AVATAR_SIZE =
	MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE +
	CIRCLE_BORDER.PADDING * 2 +
	CIRCLE_BORDER.BORDER_WIDTH * 2;

type UpdateMode = 'COVER' | 'AVATAR';

const Account = (props: AccountProps) => {
	const { navigation } = props;
	const theme = useTheme();
	const { profile } = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();
	const { launchCamera, launchImageLibrary } = useImagePicker();

	const renderTooltip = (children: ReactNode, mode: UpdateMode) => {
		return (
			<Tooltip
				actionType="press"
				pointerColor={globalStyles.paper.backgroundColor}
				containerStyle={{
					...globalStyles.paper,
					...globalStyles.shadow,
					height: 'auto',
				}}
				popover={
					<View style={[stackStyles.center]}>
						<Button mode="contained" onPress={onPressViewImage} soundName="button_click.mp3">
							Xem ảnh
						</Button>
						<Button mode="contained" onPress={() => onPressTakePhoto(mode)} soundName="button_click.mp3">
							Chụp ảnh
						</Button>
						<Button mode="contained" onPress={() => onPressUploadImage(mode)} soundName="button_click.mp3">
							Tải ảnh lên
						</Button>
					</View>
				}
			>
				{children}
			</Tooltip>
		);
	};
	const onPressSetting = () => {
		navigation.navigate('Setting');
	};
	const onPressViewImage = () => {
		console.log('view image');
	};
	const onPressTakePhoto = async (mode: UpdateMode) => {
		try {
			const result = await launchCamera({ mediaType: 'photo' });
			if (!result) return;

			const { assets } = result;
			const asset = assets?.[0];
			if (!asset) return;

			uploadImage(asset, mode);
		} catch (error) {
			openDialog({
				title: '[Chụp ảnh] Lỗi',
				content: (error as any).message,
			});
		}
	};
	const onPressUploadImage = async (mode: UpdateMode) => {
		try {
			const result = await launchImageLibrary({ mediaType: 'photo' });
			if (!result) return;

			const { assets } = result;
			const asset = assets?.[0];
			if (!asset) return;

			uploadImage(asset, mode);
		} catch (error) {
			openDialog({
				title: '[Tải ảnh] Lỗi',
				content: (error as any).message,
			});
		}
	};
	const uploadImage = (asset: Asset, mode: UpdateMode) => {
		switch (mode) {
			case 'COVER':
				dispatch(
					updateCover({
						cover: {
							...asset,
							name: asset.fileName,
						},
					})
				);
				break;
			case 'AVATAR':
				dispatch(
					updateAvatar({
						avatar: {
							...asset,
							name: asset.fileName,
						},
					})
				);
				break;
			default:
				break;
		}
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
				<View>{renderTooltip(<Cover cover={profile.cover} />, 'COVER')}</View>
				<View style={[styles.avatar]}>
					{renderTooltip(
						<Avatar size={MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.ICON_SIZE} avatar={profile.avatar} />,
						'AVATAR'
					)}
				</View>
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
