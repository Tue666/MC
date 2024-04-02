import { Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { IInventoryItem } from '../../screens/main/Inventory.screen';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { openModal } from '../../utils';
import { TouchableBox } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface InventoryItemProps {
	width: number;
	item: IInventoryItem;
}

const InventoryItem = (props: InventoryItemProps) => {
	const { width, item } = props;

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
