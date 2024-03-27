import { Image, View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { APIConfig, ConstantConfig } from '../configs';

const { APP } = APIConfig;
const { MAIN_LAYOUT } = ConstantConfig;

interface RankProps extends ViewProps {
	size?: number;
}

const Rank = (props: RankProps) => {
	const { size, ...rest } = props;
	const theme = useTheme();

	return (
		<View {...rest}>
			{/* <Icon
				name="token"
				size={size || MAIN_LAYOUT.SCREENS.ACCOUNT.INFORMATION.RANK_WIDTH}
				color={theme.colors.primary}
			/> */}
			<Image
				source={{ uri: `${APP.image_storage.url}/app/rank_v.png` }}
				style={[
					{
						width: size || MAIN_LAYOUT.SCREENS.ACCOUNT.INFORMATION.RANK_WIDTH,
						height: size || MAIN_LAYOUT.SCREENS.ACCOUNT.INFORMATION.RANK_WIDTH,
						objectFit: 'contain',
					},
				]}
			/>
		</View>
	);
};

export default Rank;
