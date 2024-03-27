import { StyleSheet } from 'react-native';
import { ConstantConfig } from '../../configs';
import { IAccount } from '../../types';
import { Avatar, CountdownCircle } from '..';

const { CIRCLE_BORDER, MAIN_LAYOUT } = ConstantConfig;

interface SingleWaitingProps {
	avatar?: IAccount.Account['avatar'];
	playing?: boolean;
	duration?: number;
	onComplete?: () => any;
}

const SingleWaiting = (props: SingleWaitingProps) => {
	const { avatar, playing, duration, onComplete } = props;

	return (
		<CountdownCircle
			playing={playing}
			duration={duration}
			size={MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
			onComplete={onComplete}
			style={[styles.container]}
		>
			<Avatar animated={playing} avatar={avatar} />
		</CountdownCircle>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginVertical: CIRCLE_BORDER.MARGIN_VERTICAL,
	},
});

export default SingleWaiting;
