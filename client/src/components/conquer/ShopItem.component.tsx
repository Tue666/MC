import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { IShopItem } from '../../screens/main/Shop.screen';
import { globalStyles, stackStyles } from '../../styles';
import { openModal } from '../../utils';
import { TouchableBox } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

interface ShopItemProps {
	item: IShopItem;
}

const ShopItem = (props: ShopItemProps) => {
	const { item } = props;
	const theme = useTheme();
	const itemWidth =
		(CONTAINER_WIDTH - 5 * 2 * MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW) *
		(1 / MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW);

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
			style={[styles.container, stackStyles.center, { width: itemWidth }]}
			soundName="button_click.mp3"
		>
			<Image
				source={{ uri: item.image }}
				style={[
					styles.image,
					globalStyles.fw,
					{ height: itemWidth - MAIN_LAYOUT.SCREENS.SHOP.PADDING * 2, objectFit: 'contain' },
				]}
			/>
			<Text variant="labelSmall" numberOfLines={1} style={[{ fontWeight: 'bold' }]}>
				{item.title}
			</Text>
			<Divider style={[styles.divider, globalStyles.fw]} />
			<View style={[stackStyles.row]}>
				<Text variant="labelSmall" numberOfLines={1}>
					{item.price}{' '}
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
