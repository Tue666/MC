import { Image, View, ViewProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { APIConfig, ConstantConfig } from '../configs';
import { useAppSelector } from '../redux/hooks';
import { selectAccount } from '../redux/slices/account.slice';
import { stackStyles } from '../styles';
import { ISchema } from '../types';

const { APP } = APIConfig;
const { BUTTON } = ConstantConfig;

type Variance = 'increase' | 'decrease' | 'balance';

interface PointProps extends ViewProps {
	type: keyof ISchema.Point;
	value: number;
	variance?: Variance;
	size?: number;
}

const Point = (props: PointProps) => {
	const { type, value, variance, size, style, ...rest } = props;
	const valueVariance: Variance = variance
		? variance
		: value > 0
		? 'increase'
		: value < 0
		? 'decrease'
		: 'balance';
	const positiveValue = Math.abs(value);
	const theme = useTheme();
	const { point } = useAppSelector(selectAccount);

	return (
		<View style={[stackStyles.row, style]} {...rest}>
			{!point[type]?.icon && (
				<Icon name="layers" size={size || BUTTON.ICON_SIZE} color={theme.colors.tertiary} />
			)}
			{point[type].icon && (
				<Image
					source={{ uri: `${APP.image_storage.url}/${point[type].icon}` }}
					style={[
						{ width: size || BUTTON.ICON_SIZE, height: size || BUTTON.ICON_SIZE, objectFit: 'contain' },
					]}
				/>
			)}
			{valueVariance === 'increase' && (
				<Text variant="labelSmall" style={[{ fontWeight: 'bold', color: theme.colors.secondary }]}>
					{' '}
					+{positiveValue}
				</Text>
			)}
			{valueVariance === 'decrease' && (
				<Text variant="labelSmall" style={[{ fontWeight: 'bold', color: theme.colors.error }]}>
					{' '}
					-{positiveValue}
				</Text>
			)}
			{valueVariance === 'balance' && (
				<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
					{' '}
					{positiveValue}
				</Text>
			)}
		</View>
	);
};

export default Point;
