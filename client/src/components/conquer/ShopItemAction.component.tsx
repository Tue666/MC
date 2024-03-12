import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';
import { closeModal, openDialog } from '../../utils';
import { Button, QuantityInput } from '..';

const { MAIN_LAYOUT, MODAL } = ConstantConfig;

interface ShopItemActionProps {
	maxPurchase: number;
	price: number;
}

const ShopItemAction = (props: ShopItemActionProps) => {
	const { maxPurchase, price } = props;
	const [quantity, setQuantity] = useState(1);
	const theme = useTheme();

	const onPressBuyItem = () => {
		openDialog({
			title: 'Oh',
			content: 'Bạn không đủ Vàng để mua vật phẩm này. Quay lại sau bạn nhé.',
			actions: [{ label: 'Đồng ý' }],
		});
	};
	return (
		<View style={[stackStyles.row]}>
			<View style={[{ flex: 1 }]}>
				<View style={[stackStyles.center]}>
					<Text variant="labelMedium" style={[{ fontWeight: 'bold' }]}>
						Số lượng:
					</Text>
					<QuantityInput limit={maxPurchase} input={quantity} setInput={setQuantity} />
					<View style={[stackStyles.row]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							Tổng: {quantity * price}
						</Text>
						<Icon name="paid" size={MAIN_LAYOUT.SCREENS.SHOP.ITEM.ICON_SIZE} color={theme.colors.tertiary} />
					</View>
				</View>
			</View>
			<View style={[styles.container, stackStyles.center]}>
				<Button mode="contained" onPress={onPressBuyItem} soundName="button_click.mp3">
					Mua
				</Button>
				<Button
					mode="contained"
					buttonColor={theme.colors.error}
					textColor={theme.colors.onError}
					onPress={closeModal}
					soundName="button_click.mp3"
				>
					Hủy
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: MODAL.ITEM.SHOP_ACTION_WIDTH,
		marginLeft: MODAL.ITEM.MARGIN,
	},
});

export default ShopItemAction;
