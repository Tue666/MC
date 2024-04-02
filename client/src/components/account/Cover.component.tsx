import { Image, StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { APIConfig, ConstantConfig } from '../../configs';
import { globalStyles } from '../../styles';
import { IAccount } from '../../types';

const { APP } = APIConfig;
const { MAIN_LAYOUT } = ConstantConfig;

interface CoverProps extends ViewProps {
	cover?: IAccount.Account['cover'];
}

const Cover = (props: CoverProps) => {
	const { style, cover, ...rest } = props;
	const theme = useTheme();

	if (cover) {
		return (
			<View style={[styles.container, style]}>
				<Image
					source={{
						uri: `${APP.image_storage.host}/${APP.image_storage.path}/${cover}`,
					}}
					style={[
						styles.container,
						{
							width: '100%',
							objectFit: 'fill',
						},
					]}
				/>
			</View>
		);
	}

	return (
		<LinearGradient
			colors={[theme.colors.primary, theme.colors.primary, globalStyles.paper.backgroundColor]}
			style={[styles.container, style]}
			{...rest}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		height: MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.COVER_HEIGHT,
		borderTopLeftRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
		borderTopRightRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
	},
});

export default Cover;
