import { Avatar } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { CircleBorder } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface SingleWaitingProps {
	animated?: boolean;
}

const SingleWaiting = (props: SingleWaitingProps) => {
	const { animated } = props;

	return (
		<CircleBorder animated={animated}>
			<Avatar.Image
				size={MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
				source={require('../../assets/images/avatar.png')}
			/>
		</CircleBorder>
	);
};

export default SingleWaiting;
