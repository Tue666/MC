import { Avatar } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { CircleBorder } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const SingleWaiting = () => {
	return (
		<CircleBorder>
			<Avatar.Image
				size={MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
				source={require('../../assets/images/avatar.png')}
			/>
		</CircleBorder>
	);
};

export default SingleWaiting;
