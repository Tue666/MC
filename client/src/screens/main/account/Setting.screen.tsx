import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Button, Support } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useAuthentication } from '../../../hooks';
import { SettingProps } from '../../../types';

const { MAIN_LAYOUT } = ConstantConfig;

const Setting = (props: SettingProps) => {
	const theme = useTheme();
	const { signOut } = useAuthentication();

	return (
		<ScrollView>
			<View style={[styles.space]}>
				<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
					Hỗ trợ
				</Text>
				<Support />
			</View>
			<Button
				mode="contained"
				onPress={signOut}
				buttonColor={theme.colors.error}
				textColor={theme.colors.onError}
				style={[{ padding: 10 }]}
				soundName="button_click.mp3"
			>
				Đăng xuất
			</Button>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	space: {
		marginTop: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN * 2,
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
	},
});

export default Setting;
