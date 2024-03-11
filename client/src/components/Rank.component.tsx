import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../configs';

const { MAIN_LAYOUT } = ConstantConfig;

interface RankProps {
	size?: number;
}

const Rank = (props: RankProps) => {
	const { size } = props;
	const theme = useTheme();

	return (
		<Icon
			name="token"
			size={size || MAIN_LAYOUT.SCREENS.ACCOUNT.INFORMATION.RANK_WIDTH}
			color={theme.colors.primary}
		/>
	);
};

export default Rank;
