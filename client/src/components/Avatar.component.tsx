import { View } from 'react-native';
import { Avatar as RNPAvatar } from 'react-native-paper';
import { CircleBorderProps } from './CircleBorder.component';
import { APIConfig, ConstantConfig } from '../configs';
import { IAccount } from '../types';
import { CircleBorder } from '.';

const { APP } = APIConfig;
const { MAIN_LAYOUT } = ConstantConfig;

interface AvatarProps extends CircleBorderProps {
	hiddenBorder?: boolean;
	size?: number;
	avatar?: IAccount.Account['avatar'];
}

const Avatar = (props: AvatarProps) => {
	const { hiddenBorder = false, size, avatar, ...rest } = props;

	const renderAvatar = () => {
		if (avatar) {
			return (
				<RNPAvatar.Image
					size={size || MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
					source={{
						uri: `${APP.image_storage.url}/${avatar}`,
					}}
				/>
			);
		}

		return (
			<RNPAvatar.Image
				size={size || MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
				source={require('../assets/images/avatar.png')}
			/>
		);
	};

	if (hiddenBorder) {
		return <View {...rest}>{renderAvatar()}</View>;
	}

	return <CircleBorder {...rest}>{renderAvatar()}</CircleBorder>;
};

export default Avatar;
