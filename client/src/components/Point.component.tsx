import { Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { APIConfig, ConstantConfig } from '../configs';
import { useAppSelector } from '../redux/hooks';
import { selectAccount } from '../redux/slices/account.slice';
import { ISchema } from '../types';

const { APP } = APIConfig;
const { BUTTON } = ConstantConfig;

interface PointProps {
	type: keyof ISchema.Point;
	size?: number;
}

const Point = (props: PointProps) => {
	const { type, size } = props;
	const theme = useTheme();
	const { point } = useAppSelector(selectAccount);

	if (!point?.[type]?.icon)
		return <Icon name="layers" size={size || BUTTON.ICON_SIZE} color={theme.colors.tertiary} />;

	return (
		<Image
			source={{ uri: `${APP.image_storage.url}/${point[type].icon}` }}
			style={[
				{ width: size || BUTTON.ICON_SIZE, height: size || BUTTON.ICON_SIZE, objectFit: 'contain' },
			]}
		/>
	);
};

export default Point;
