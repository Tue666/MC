import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles } from '../../styles';
import { InventoryItem } from '../../components';

const { MAIN_LAYOUT } = ConstantConfig;

export interface IInventoryItem {
	_id: string;
	title: string;
	image: string;
	requirement: string;
	maxPurchase: number;
	price: number;
	description: string;
}

const INVENTORY_ITEMS = Array.from({ length: 20 }, (_, index) => ({
	_id: (index + 1).toString(),
	title: `Rương ẩn LV.${index + 1}`,
	image: 'https://res.cloudinary.com/tipegallery/image/upload/app/mystery-chest.png',
	requirement: `Cần đạt LV.${index + 1} để sử dụng`,
	maxPurchase: index + 1,
	price: index + 1,
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque facilisis, sem et condimentum malesuada, elit justo interdum augue, non congue turpis tortor sit amet sem. Vestibulum hendrerit erat id turpis condimentum, eu condimentum erat tempor. Morbi mattis consequat dapibus. Nam vel elit aliquam, placerat libero at, cursus justo. Aenean vitae sollicitudin mi, ac porta ante. Ut nec libero magna. Ut vestibulum tellus at tempor suscipit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer in urna metus. Ut dictum sem sed ipsum rhoncus, vitae consequat metus dapibus. Sed facilisis rhoncus pellentesque. Integer viverra, libero quis cursus elementum, erat lectus tincidunt odio, a commodo quam mi ac sem. Nam ut pharetra urna. Integer aliquam lacinia urna in pharetra. Nam viverra augue sapien, et feugiat tellus varius eget.',
}));

const Inventory = () => {
	return (
		<View style={[globalStyles.container]}>
			<View style={[stackStyles.center, styles.top]}>
				<Image
					source={require('../../assets/images/inventory.png')}
					style={[
						{
							width: MAIN_LAYOUT.SCREENS.ICON_SIZE,
							height: MAIN_LAYOUT.SCREENS.ICON_SIZE,
						},
					]}
				/>
			</View>
			<FlatList
				data={INVENTORY_ITEMS}
				renderItem={({ item }) => <InventoryItem item={item} />}
				keyExtractor={(item) => item._id}
				numColumns={MAIN_LAYOUT.SCREENS.INVENTORY.NUMBER_ITEM_IN_ROW}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	top: {
		margin: MAIN_LAYOUT.SCREENS.MARGIN,
	},
});

export default Inventory;
