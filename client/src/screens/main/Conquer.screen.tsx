import { useState } from 'react';
import {
	Dimensions,
	RefreshControl,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import useGlobalStyles from '../../styles/global.style';
import { openDialog } from '../../utils/dialog.util';
import { MAIN_LAYOUT } from '../../configs/constant';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { initAccount, selectAccount } from '../../redux/slices/account.slice';

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

const RESOURCE_ARRANGEMENT = [
	// Total 1 row is 1
	[1],
	[0.3, 0.3, 0.4],
	[0.7, 0.3],
	[0.5, 0.5],
	[1],
];

const RESOURCE_DIFFICULTY = (theme: MD3Theme) => ({
	easy: {
		label: 'Dễ',
		bgColor: theme.colors.primary,
		textColor: theme.colors.onPrimary,
		range: [0, 1],
	},
	middle: {
		label: undefined,
		bgColor: undefined,
		textColor: undefined,
		range: [2, 6],
	},
	hard: {
		label: undefined,
		bgColor: undefined,
		textColor: undefined,
		range: [7, 9],
	},
	nightmare: {
		label: 'Cực Khó',
		bgColor: theme.colors.error,
		textColor: theme.colors.onError,
		range: [10, 999999999],
	},
});

const getDifficultLevel = (
	difficulty: number,
	resourceDifficulty: ReturnType<typeof RESOURCE_DIFFICULTY>
) => {
	for (const [key, value] of Object.entries(resourceDifficulty)) {
		const [min, max] = value.range;
		if (difficulty >= min && difficulty <= max) return key;
	}

	return Object.keys(resourceDifficulty)[0];
};

const Conquer = () => {
	let ROW_INDEX = 0;
	let COLUMN_INDEX = 0;

	const theme = useTheme();
	const globalStyles = useGlobalStyles();
	const { permissions } = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();
	const [refreshing, setRefreshing] = useState(false);
	const resourceDifficulty = RESOURCE_DIFFICULTY(theme);

	const onPressResource = (title: string, operations: string[]) => {
		if (operations.indexOf('ENTER') === -1) {
			openDialog({
				title,
				content: 'Tài khoản chưa được cấp quyền tham gia tính năng này!',
				actions: [{ label: 'Đồng ý' }],
			});
			return;
		}

		openDialog({
			title,
			content: 'Chiến thôi!',
			actions: [{ label: 'Ghép' }],
		});
	};
	const onLongPressResource = (title: string, description: string) => {
		openDialog({
			title,
			content: description,
			contentScrollable: true,
			actions: [{ label: 'Đã hiểu' }],
		});
	};
	const onRefreshScreen = async () => {
		setRefreshing(true);
		await dispatch(initAccount());
		setRefreshing(false);
	};
	return (
		<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshScreen} />}>
			<View style={{ ...styles.container }}>
				{Object.entries(permissions).map(([resourceAllowed, permissionAllowed]) => {
					// Stop render out of arrangement
					if (ROW_INDEX >= RESOURCE_ARRANGEMENT.length) return;

					const { name, description, difficulty, operations } = permissionAllowed;
					const difficultLevel = getDifficultLevel(difficulty, resourceDifficulty);
					const { label, bgColor, textColor } =
						resourceDifficulty[difficultLevel as keyof typeof resourceDifficulty];
					const resourcesInRow = RESOURCE_ARRANGEMENT[ROW_INDEX].length;
					const resourceWidth =
						(CONTAINER_WIDTH - MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.MARGIN * 2 * resourcesInRow) *
						RESOURCE_ARRANGEMENT[ROW_INDEX][COLUMN_INDEX];

					// Continue next column
					COLUMN_INDEX++;
					if (COLUMN_INDEX >= resourcesInRow) {
						// Continue next row
						ROW_INDEX++;
						// Reset column
						COLUMN_INDEX = 0;
					}

					return (
						<TouchableOpacity
							key={resourceAllowed}
							onPress={() => onPressResource(name, operations)}
							onLongPress={() => onLongPressResource(name, description)}
							style={{
								...styles.resource,
								...globalStyles.shadow,
								...(bgColor ? { backgroundColor: bgColor } : globalStyles.paper),
								width: resourceWidth,
							}}
						>
							<Text style={{ ...{ color: textColor ? textColor : theme.colors.onSurface } }}>{name}</Text>
							{label && (
								<Text variant="labelSmall" style={{ ...{ color: textColor ? textColor : theme.colors.onSurface } }}>
									({label})
								</Text>
							)}
						</TouchableOpacity>
					);
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
		alignItems: 'center',
		margin: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.MARGIN,
		padding: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.PADDING,
		borderRadius: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.BORDER_RADIUS,
	},
});

export default Conquer;
