import { Linking, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { typographyStyles } from '../../styles';
import { TouchableBox } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const Support = () => {
	const onPressSupport = () => {
		Linking.openURL('mailto:lechinhtue292001@gmail.com?subject=CM-[App] Support');
	};
	return (
		<View>
			<TouchableBox onPress={onPressSupport} style={[styles.support]}>
				<Text variant="labelSmall" style={[typographyStyles.bold]}>
					App
				</Text>
			</TouchableBox>
		</View>
	);
};

const styles = StyleSheet.create({
	support: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default Support;
