import { ViewProps } from 'react-native';
import { Avatar as RNPAvatar } from 'react-native-paper';
import { ConstantConfig } from '../configs';
import { CircleBorder } from '.';

const { MAIN_LAYOUT } = ConstantConfig;

interface AvatarProps extends Omit<ViewProps, 'source'> {
	size?: number;
}

const Avatar = (props: AvatarProps) => {
	const { size, ...rest } = props;

	return (
		<CircleBorder {...rest}>
			<RNPAvatar.Image
				size={size || MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
				source={require('../assets/images/avatar.png')}
			/>
		</CircleBorder>
	);
};

export default Avatar;
