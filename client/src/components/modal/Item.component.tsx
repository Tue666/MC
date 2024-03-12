import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderHTML from 'react-native-render-html';
import { ConstantConfig } from '../../configs';
import { IShopItem } from '../../screens/main/Shop.screen';
import { globalStyles, stackStyles } from '../../styles';
import { InventoryItemAction, ShopItemAction } from '..';

const { MAIN_LAYOUT, MODAL } = ConstantConfig;

export type ItemMode = 'SHOP' | 'INVENTORY';

export interface ItemProps {
	mode: ItemMode;
	item: IShopItem;
}

const Item = (props: ItemProps) => {
	const { mode, item } = props;
	const { title, requirement, maxPurchase, price, description } = item;
	const { width } = useWindowDimensions();
	const theme = useTheme();

	return (
		<View style={[styles.container, globalStyles.paper, globalStyles.shadow]}>
			<View style={[styles.header, stackStyles.row, { backgroundColor: theme.colors.tertiary }]}>
				<Image source={{ uri: item.image }} style={[styles.image]} />
				<View style={[{ flex: 1 }]}>
					<Text variant="labelLarge" style={[{ fontWeight: 'bold' }]}>
						{title}
					</Text>
					<Text variant="labelSmall" style={[{ fontStyle: 'italic' }]}>
						Hiếm
					</Text>
					<Text variant="labelSmall">{requirement}</Text>
					{mode === 'SHOP' && (
						<Text variant="labelSmall">
							Giới hạn tuần: {maxPurchase}/{maxPurchase}
						</Text>
					)}
				</View>
			</View>
			<Divider style={[styles.divider]} />
			<ScrollView style={[styles.body]}>
				<RenderHTML
					contentWidth={width}
					source={{
						html: `<div style="color: ${theme.colors.onSurface};">${description}</div>`,
					}}
				/>
			</ScrollView>
			{mode === 'SHOP' && (
				<>
					<Divider style={[styles.divider]} />
					<View style={[{ alignItems: 'flex-end' }]}>
						<View style={[stackStyles.row]}>
							<Text variant="labelSmall">Giá: {price} </Text>
							<Icon name="paid" size={MAIN_LAYOUT.SCREENS.SHOP.ITEM.ICON_SIZE} color={theme.colors.tertiary} />
						</View>
					</View>
				</>
			)}
			<Divider style={[styles.divider]} />
			{mode === 'SHOP' && <ShopItemAction maxPurchase={item.maxPurchase} price={item.price} />}
			{mode === 'INVENTORY' && <InventoryItemAction />}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: MODAL.ITEM.WIDTH,
		padding: MODAL.ITEM.PADDING,
		borderRadius: MODAL.ITEM.BORDER_RADIUS,
	},
	divider: {
		marginVertical: MODAL.ITEM.MARGIN,
	},
	header: {
		padding: MODAL.ITEM.PADDING,
		borderRadius: MODAL.ITEM.BORDER_RADIUS,
	},
	image: {
		width: MODAL.ITEM.IMAGE_SIZE,
		height: MODAL.ITEM.IMAGE_SIZE,
		marginRight: MODAL.ITEM.MARGIN,
	},
	body: {
		height: MODAL.ITEM.BODY_HEIGHT,
		paddingHorizontal: MODAL.ITEM.PADDING,
	},
});

export default Item;
