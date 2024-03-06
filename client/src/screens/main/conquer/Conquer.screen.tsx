import { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { TouchableBox } from '../../../components';
import { ConstantConfig, ResourceConfig } from '../../../configs';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { initAccount, selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerProps, ConquerStackListParams } from '../../../types';
import { openDialog } from '../../../utils';

const { MAIN_LAYOUT } = ConstantConfig;
const { CONQUER_RENDERER, RESOURCE_ARRANGEMENT, RESOURCE_DIFFICULTIES, getDifficultLevel } =
	ResourceConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

const Conquer = (props: ConquerProps) => {
	let ROW_INDEX = 0;
	let COLUMN_INDEX = 0;
	const { RESOURCES } = CONQUER_RENDERER;

	const { navigation } = props;
	const theme = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const { resources } = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();
	const resourceDifficulty = RESOURCE_DIFFICULTIES(theme);

	const onPressResource = (params: ConquerStackListParams<'Waiting'>) => {
		navigation.navigate('Waiting', params);
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
			<View style={[stackStyles.rowWrap]}>
				{Object.entries(resources).map(([resourceAllowed, permissionAllowed]) => {
					// Stop render out of arrangement
					if (ROW_INDEX >= RESOURCE_ARRANGEMENT.length) return;

					const { _id, name, description, difficulty } = permissionAllowed;
					const idleMode = RESOURCES[_id]?.idleMode || 'SINGLE';
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
						<TouchableBox
							key={resourceAllowed}
							onPress={() => onPressResource({ resource: permissionAllowed, idleMode })}
							onLongPress={() => onLongPressResource(name, description)}
							style={[
								styles.resource,
								{ backgroundColor: bgColor || globalStyles.paper.backgroundColor, width: resourceWidth },
							]}
							soundName="button_click.mp3"
						>
							<Text style={[{ color: textColor || theme.colors.onSurface }]}>{name}</Text>
							{label && (
								<Text variant="labelSmall" style={[{ color: textColor || theme.colors.onSurface }]}>
									({label})
								</Text>
							)}
						</TouchableBox>
					);
				})}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	resource: {
		alignItems: 'center',
		margin: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.MARGIN,
		padding: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.PADDING,
	},
});

export default Conquer;
