import { GestureResponderEvent, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Button as RNPButton, ButtonProps as RNPButtonProps } from 'react-native-paper';
import { SoundManager, SoundName } from '../../audios';

interface ButtonProps extends RNPButtonProps {
	soundName?: SoundName;
	outerProps?: TouchableOpacityProps;
}

const Button = (props: ButtonProps) => {
	const { soundName, outerProps, children, ...buttonProps } = props;

	const onOverridePress = (e: GestureResponderEvent) => {
		if (soundName) {
			SoundManager.playSound(soundName);
		}

		if (outerProps?.onPress) {
			outerProps.onPress(e);
		}
	};
	return (
		<TouchableOpacity {...outerProps} onPress={onOverridePress}>
			<RNPButton {...buttonProps}>{children}</RNPButton>
		</TouchableOpacity>
	);
};

export default Button;
