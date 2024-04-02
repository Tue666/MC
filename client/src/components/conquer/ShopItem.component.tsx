import { Image, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { IShopItem } from '../../screens/main/Shop.screen';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { NumberUtil, openModal } from '../../utils';
import { TouchableBox } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface ShopItemProps {
	width: number;
	item: IShopItem;
}

const ShopItem = (props: ShopItemProps) => {
	const { width, item } = props;
	const theme = useTheme();

	const onPressItem = () => {
		openModal<'ITEM'>({
			component: 'ITEM',
			params: {
				mode: 'SHOP',
				item,
			},
		});
	};
	return (
		<TouchableBox
			onPress={onPressItem}
			style={[styles.container, stackStyles.center, { width }]}
			soundName="button_click.mp3"
		>
			<Image
				source={{ uri: item.image }}
				style={[
					styles.image,
					globalStyles.fw,
					{ height: width - MAIN_LAYOUT.SCREENS.SHOP.PADDING * 2, objectFit: 'contain' },
				]}
			/>
			<Text variant="labelSmall" numberOfLines={1} style={[typographyStyles.bold]}>
				{item.title}
			</Text>
			<Divider style={[styles.divider, globalStyles.fw]} />
			<View style={[stackStyles.row]}>
				<Text variant="labelSmall" numberOfLines={1}>
					{NumberUtil.toNumberWithDots(item.price)}{' '}
				</Text>
				<Icon name="paid" size={MAIN_LAYOUT.SCREENS.SHOP.ITEM.ICON_SIZE} color={theme.colors.tertiary} />
			</View>
		</TouchableBox>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.SCREENS.SHOP.PADDING,
		margin: MAIN_LAYOUT.SCREENS.SHOP.MARGIN / 2,
	},
	image: {
		borderRadius: MAIN_LAYOUT.SCREENS.SHOP.BORDER_RADIUS,
	},
	divider: {
		marginVertical: MAIN_LAYOUT.SCREENS.SHOP.MARGIN / 2,
	},
});

export default ShopItem;
