import { GestureResponderEvent, StyleSheet, TouchableOpacity } from 'react-native';
import { Button as RNPButton, ButtonProps as RNPButtonProps, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { SoundManager, SoundName } from '../../audios';

const { SPACE_GAP, BUTTON } = ConstantConfig;

interface ButtonProps extends RNPButtonProps {
	icon?: string;
	iconSize?: number;
	iconColor?: string;
	soundName?: SoundName;
	innerStyle?: RNPButtonProps['style'];
}

const Button = (props: ButtonProps) => {
	const { icon, iconSize, iconColor, soundName, innerStyle, children, style, onPress, ...rest } =
		props;
	const theme = useTheme();

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
			disabled={rest.disabled}
			style={[styles.container, style]}
			onPress={onOverridePress}
		>
			<RNPButton
				icon={
					icon
						? () => (
								<Icon name={icon} size={iconSize || BUTTON.ICON_SIZE} color={iconColor || theme.colors.onPrimary} />
						  )
						: undefined
				}
				style={innerStyle}
				{...rest}
			>
				{children}
			</RNPButton>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginVertical: SPACE_GAP / 2,
	},
});

export default Button;
