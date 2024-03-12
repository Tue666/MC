import { useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';
import { closeModal, openDialog } from '../../utils';
import { Button } from '..';

const { MODAL } = ConstantConfig;

const InventoryItemAction = () => {
	const theme = useTheme();

	const onPressUseItem = () => {
		openDialog({
			title: 'Oh',
			content: 'Bạn không đủ yêu cầu để sử dụng vật phẩm này. Thử lại sau nhé.',
			actions: [{ label: 'Đồng ý' }],
		});
	};
	return (
		<View style={[{ alignItems: 'flex-end' }]}>
			<View style={[styles.container, stackStyles.center]}>
				<Button mode="contained" onPress={onPressUseItem} soundName="button_click.mp3">
					Sử dụng
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
		width: MODAL.ITEM.INVENTORY_ACTION_WIDTH,
		marginLeft: MODAL.ITEM.MARGIN,
	},
});

export default InventoryItemAction;
