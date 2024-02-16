import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import useGlobalStyles from '../../styles/global.style';
import { openDialog } from '../../utils/dialog.util';
import { MAIN_LAYOUT } from '../../configs/constant';

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

const RESOURCES = [
	[
		{
			id: 9999,
			title: 'Nhanh Tay Lẹ Mắt :D',
			size: 1,
			special: true,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
	],
	[
		{
			id: 1,
			title: '1 VS 1',
			size: 0.3,
			special: true,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
		{
			id: 2,
			title: '5 VS 5',
			size: 0.3,
			special: false,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
		{
			id: 3,
			title: 'Sự Kiện',
			size: 0.4,
			special: true,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
	],
	[
		{
			id: 4,
			title: 'Leo Tháp',
			size: 0.7,
			special: false,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
		{
			id: 5,
			title: 'AI',
			size: 0.3,
			special: false,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
	],
	[
		{
			id: 6,
			title: 'Tìm Sao',
			size: 0.5,
			special: true,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
		{
			id: 7,
			title: 'Luyện Tập',
			size: 0.5,
			special: false,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
	],
	[
		{
			id: 8,
			title: 'Thử Thách',
			size: 1,
			special: false,
			description: 'Đè nút lâu để mở mô tả cho tính năng :D',
		},
	],
];

const Conquer = () => {
	const theme = useTheme();
	const globalStyles = useGlobalStyles();

	const onPressSource = (title: string) => {
		console.log(`Start: ${title}`);
	};
	const onLongPressSource = (title: string, description: string) => {
		openDialog({
			title,
			content: description,
			actions: [{ label: 'Đã hiểu' }],
		});
	};
	return (
		<ScrollView>
			<View style={{ ...styles.container }}>
				{RESOURCES.map((group) => {
					const groupLength = group.length;

					return group.map((resource) => {
						const { id, title, size, special, description } = resource;
						const ITEM_WIDTH =
							(CONTAINER_WIDTH - MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.MARGIN * 2 * groupLength) * size;

						return (
							<TouchableOpacity
								key={id}
								onPress={() => onPressSource(title)}
								onLongPress={() => onLongPressSource(title, description)}
								style={{
									...styles.resource,
									...globalStyles.shadow,
									...(special ? { backgroundColor: theme.colors.primary } : globalStyles.paper),
									width: ITEM_WIDTH,
								}}
							>
								<Text style={{ ...{ color: special ? theme.colors.onPrimary : theme.colors.onSurface } }}>
									{title}
								</Text>
							</TouchableOpacity>
						);
					});
				})}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	resource: {
		margin: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.MARGIN,
		padding: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.PADDING,
		alignItems: 'center',
		borderRadius: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.BORDER_RADIUS,
	},
});

export default Conquer;
