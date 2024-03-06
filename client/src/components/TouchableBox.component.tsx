import { GestureResponderEvent, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SoundManager, SoundName } from '../audios';
import { ConstantConfig } from '../configs';
import { globalStyles } from '../styles';

const { BOX } = ConstantConfig;

interface TouchableBoxProps extends TouchableOpacityProps {
	soundName?: SoundName;
}

const TouchableBox = (props: TouchableBoxProps) => {
	const { soundName, children, style, onPress, ...rest } = props;

	const onOverridePress = (e: GestureResponderEvent) => {
		if (soundName) {
			SoundManager.playSound(soundName);
		}

		if (onPress) {
			onPress(e);
		}
	};
	return (
		<TouchableOpacity
			style={[globalStyles.paper, globalStyles.shadow, { borderRadius: BOX.BORDER_RADIUS }, style]}
			onPress={onOverridePress}
			{...rest}
		>
			{children}
		</TouchableOpacity>
	);
};

export default TouchableBox;
