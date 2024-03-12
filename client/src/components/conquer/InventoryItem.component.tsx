import { Dimensions, Image, StyleSheet } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { IInventoryItem } from '../../screens/main/Inventory.screen';
import { globalStyles, stackStyles } from '../../styles';
import { openModal } from '../../utils';
import { TouchableBox } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

interface InventoryItemProps {
	item: IInventoryItem;
}

const InventoryItem = (props: InventoryItemProps) => {
	const { item } = props;
	const itemWidth =
		(CONTAINER_WIDTH - 5 * 2 * MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW) *
		(1 / MAIN_LAYOUT.SCREENS.SHOP.NUMBER_ITEM_IN_ROW);

	const onPressItem = () => {
		openModal<'ITEM'>({
			component: 'ITEM',
			params: {
				mode: 'INVENTORY',
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
		</TouchableBox>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.SCREENS.INVENTORY.PADDING,
		margin: MAIN_LAYOUT.SCREENS.INVENTORY.MARGIN / 2,
	},
	image: {
		borderRadius: MAIN_LAYOUT.SCREENS.INVENTORY.BORDER_RADIUS,
	},
});

export default InventoryItem;
