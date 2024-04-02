import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { Box, ShopItem } from '../../components';
import { APIConfig, ConstantConfig } from '../../configs';
import { globalStyles, stackStyles } from '../../styles';

const { APP } = APIConfig;
const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;
const ITEM_WIDTH =
	(CONTAINER_WIDTH - 5 * 2 * MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW) *
	(1 / MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW);

export interface IShopItem {
	_id: string;
	title: string;
	image: string;
	requirement: string;
	maxPurchase: number;
	price: number;
	description: string;
}

const SHOP_ITEMS = Array.from({ length: 20 }, (_, index) => ({
	_id: (index + 1).toString(),
	title: `Cuộn x${index + 1} Vàng`,
	image: `${APP.image_storage.host}/${APP.image_storage.path}/app/scroll.png`,
	requirement: `Cần đạt LV.999999 để sử dụng`,
	maxPurchase: index + 1,
	price: 999999,
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque facilisis, sem et condimentum malesuada, elit justo interdum augue, non congue turpis tortor sit amet sem. Vestibulum hendrerit erat id turpis condimentum, eu condimentum erat tempor. Morbi mattis consequat dapibus. Nam vel elit aliquam, placerat libero at, cursus justo. Aenean vitae sollicitudin mi, ac porta ante. Ut nec libero magna. Ut vestibulum tellus at tempor suscipit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer in urna metus. Ut dictum sem sed ipsum rhoncus, vitae consequat metus dapibus. Sed facilisis rhoncus pellentesque. Integer viverra, libero quis cursus elementum, erat lectus tincidunt odio, a commodo quam mi ac sem. Nam ut pharetra urna. Integer aliquam lacinia urna in pharetra. Nam viverra augue sapien, et feugiat tellus varius eget.',
}));

const Shop = () => {
	const theme = useTheme();

	return (
		<View style={[globalStyles.container]}>
			<Box style={[stackStyles.center, styles.top, { backgroundColor: theme.colors.tertiary }]}>
				<Image
					source={require('../../assets/images/shop.png')}
					style={[
						{
							width: MAIN_LAYOUT.SCREENS.ICON_SIZE,
							height: MAIN_LAYOUT.SCREENS.ICON_SIZE,
						},
					]}
				/>
			</Box>
			<Divider />
			<FlatList
				data={SHOP_ITEMS}
				renderItem={({ item }) => <ShopItem width={ITEM_WIDTH} item={item} />}
				keyExtractor={(item) => item._id}
				numColumns={MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	top: {
		padding: MAIN_LAYOUT.SCREENS.PADDING,
		margin: MAIN_LAYOUT.SCREENS.MARGIN,
	},
});

export default Shop;
