import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { SoundManager } from '../audios';
import { ConstantConfig } from '../configs';
import { useSetting } from '../hooks';
import { useAppSelector } from '../redux/hooks';
import { selectAccount } from '../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../styles';
import { openModal } from '../utils';
import { Point } from '.';

const { MAIN_LAYOUT } = ConstantConfig;

const MainHeader = () => {
	const theme = useTheme();
	const { profile } = useAppSelector(selectAccount);
	const { themeMode, onChangeTheme } = useSetting();

	const onPressConversation = () => {
		SoundManager.playSound('button_click.mp3');
		openModal<'CONVERSATION'>({
			component: 'CONVERSATION',
			params: {},
		});
	};
	const onPressChangeTheme = () => {
		SoundManager.playSound('button_click.mp3');
		onChangeTheme();
	};
	return (
		<View style={[styles.header, globalStyles.paper, globalStyles.shadow, stackStyles.row]}>
			<View style={[stackStyles.row]}>
				<Point
					type="gold_point"
					value={profile.gold_point.value}
					variance="balance"
					size={MAIN_LAYOUT.HEADER.ICON_SIZE}
				/>
			</View>
			<View style={[stackStyles.row]}>
				<TouchableOpacity onPress={onPressConversation}>
					<Icon name="forum" size={MAIN_LAYOUT.HEADER.ICON_SIZE} color={theme.colors.outline} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Icon
						name={themeMode === 'light' ? 'dark-mode' : 'light-mode'}
						size={MAIN_LAYOUT.HEADER.ICON_SIZE}
						color={theme.colors.tertiary}
						onPress={onPressChangeTheme}
						style={[styles.icon]}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		justifyContent: 'space-between',
		height: MAIN_LAYOUT.HEADER.HEIGHT,
		padding: MAIN_LAYOUT.HEADER.PADDING,
		marginBottom: MAIN_LAYOUT.HEADER.MARGIN_BOTTOM,
		borderRadius: MAIN_LAYOUT.HEADER.BORDER_RADIUS,
	},
	icon: {
		marginLeft: MAIN_LAYOUT.HEADER.PADDING * 2,
	},
});

export default MainHeader;
