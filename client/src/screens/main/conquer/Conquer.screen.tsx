import { useState } from 'react';
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Box, TouchableBox } from '../../../components';
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
		<View style={[globalStyles.container]}>
			<Box style={[stackStyles.center, styles.top, { backgroundColor: theme.colors.primary }]}>
				<Image
					source={require('../../../assets/images/conquer.png')}
					style={[
						{
							width: MAIN_LAYOUT.SCREENS.ICON_SIZE,
							height: MAIN_LAYOUT.SCREENS.ICON_SIZE,
						},
					]}
				/>
			</Box>
			<Divider />
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshScreen} />}>
				<View style={[stackStyles.rowWrap]}>
					{Object.entries(resources).map(([resourceAllowed, permissionAllowed]) => {
						// Stop render out of arrangement
						if (ROW_INDEX >= RESOURCE_ARRANGEMENT.length) return;

						const { _id, name, description, difficulty } = permissionAllowed;
						const resource = RESOURCES[_id];
						const idleMode = resource?.idleMode || 'SINGLE';
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
								disabled={!resource}
								onPress={() => onPressResource({ resource: permissionAllowed, idleMode })}
								onLongPress={() => onLongPressResource(name, description)}
								style={[
									styles.resource,
									{ backgroundColor: resource ? bgColor : theme.colors.outline, width: resourceWidth },
								]}
								soundName="button_click.mp3"
							>
								<View style={[stackStyles.row]}>
									{!resource && <Icon name="lock" color={resource ? textColor : theme.colors.outlineVariant} />}
									<Text style={[{ color: resource ? textColor : theme.colors.outlineVariant }]}>{name}</Text>
								</View>
								{label && (
									<Text variant="labelSmall" style={[{ color: resource ? textColor : theme.colors.outlineVariant }]}>
										({label})
									</Text>
								)}
							</TouchableBox>
						);
					})}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	top: {
		padding: MAIN_LAYOUT.SCREENS.PADDING,
		margin: MAIN_LAYOUT.SCREENS.MARGIN,
	},
	resource: {
		alignItems: 'center',
		margin: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.MARGIN,
		padding: MAIN_LAYOUT.SCREENS.CONQUER.RESOURCE.PADDING,
	},
});

export default Conquer;
