import { StyleSheet, View } from 'react-native';
import { Avatar as RNPAvatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CircleBorderProps } from './CircleBorder.component';
import { APIConfig, ConstantConfig } from '../configs';
import { IAccount } from '../types';
import { CircleBorder, Rank } from '.';

const { APP } = APIConfig;
const { MAIN_LAYOUT } = ConstantConfig;

interface AvatarProps extends CircleBorderProps {
	disconnected?: boolean;
	noBorder?: boolean;
	noRank?: boolean;
	avatar?: IAccount.Account['avatar'];
	size?: number;
}

const Avatar = (props: AvatarProps) => {
	const { disconnected, noBorder, noRank, size, avatar, ...rest } = props;
	const theme = useTheme();
	const iconStyle = [
		styles.rank,
		{
			bottom: 0 - (size ? size / 4 : MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE / 4),
			right: 0 - (size ? size / 4 : MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE / 4),
		},
	];

	const renderAvatar = () => {
		return (
			<View style={[styles.container]}>
				{avatar && (
					<RNPAvatar.Image
						size={size || MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
						source={{
							uri: `${APP.image_storage.url}/${avatar}`,
						}}
					/>
				)}
				{!avatar && (
					<RNPAvatar.Image
						size={size || MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
						source={require('../assets/images/avatar.png')}
					/>
				)}
				{!noRank && !disconnected && (
					<Rank
						size={size ? size / 1.5 : MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE / 1.5}
						style={iconStyle}
					/>
				)}
				{!noRank && disconnected && (
					<Icon
						name="wifi-off"
						size={size ? size / 1.5 : MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE / 1.5}
						color={theme.colors.error}
						style={iconStyle}
					/>
				)}
				{noRank && disconnected && (
					<Icon
						name="wifi-off"
						size={size ? size / 1.5 : MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE / 1.5}
						color={theme.colors.error}
						style={iconStyle}
					/>
				)}
			</View>
		);
	};

	if (noBorder) {
		return <View {...rest}>{renderAvatar()}</View>;
	}

	return <CircleBorder {...rest}>{renderAvatar()}</CircleBorder>;
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	rank: {
		position: 'absolute',
	},
});

export default Avatar;
