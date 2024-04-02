import { DimensionValue, ScrollView, useWindowDimensions } from 'react-native';
import { Button, Portal, Dialog as RNPDialog, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderHTML from 'react-native-render-html';
import { ConstantConfig } from '../../configs';
import { useAppSelector } from '../../redux/hooks';
import { selectDialog } from '../../redux/slices/dialog.slice';
import { globalStyles, typographyStyles } from '../../styles';
import { closeDialog } from '../../utils';

const { DIALOG } = ConstantConfig;

const Dialog = () => {
	const { width } = useWindowDimensions();
	const theme = useTheme();
	const { isOpen, closable, icon, title, content, contentScrollable, actions } =
		useAppSelector(selectDialog);

	return (
		<Portal>
			<RNPDialog
				visible={isOpen}
				dismissable={closable}
				dismissableBackButton={closable}
				onDismiss={closeDialog}
				style={[globalStyles.paper]}
			>
				{icon && <RNPDialog.Icon icon={() => <Icon name={icon} size={DIALOG.ICON_SIZE} />} />}
				{title && (
					<RNPDialog.Title>
						<Text variant="titleMedium" style={[typographyStyles.bold]}>
							{title}
						</Text>
					</RNPDialog.Title>
				)}
				{content && !contentScrollable && (
					<RNPDialog.Content>
						<RenderHTML
							contentWidth={width}
							source={{
								html: `<div style="color: ${theme.colors.onSurface};">${content}</div>`,
							}}
						/>
					</RNPDialog.Content>
				)}
				{content && contentScrollable && (
					<RNPDialog.ScrollArea
						style={[
							{
								maxHeight: DIALOG.SCROLL_CONTENT.MAX_HEIGHT as DimensionValue,
								padding: DIALOG.SCROLL_CONTENT.PADDING,
							},
						]}
					>
						<ScrollView>
							<RenderHTML
								contentWidth={width}
								source={{
									html: `<div style="color: ${theme.colors.onSurface};">${content}</div>`,
								}}
							/>
						</ScrollView>
					</RNPDialog.ScrollArea>
				)}
				{actions && actions.length > 0 && (
					<RNPDialog.Actions>
						{actions.map((action, index) => {
							const { label, color } = action;
							return (
								<Button key={index} textColor={color} onPress={closeDialog}>
									{label}
								</Button>
							);
						})}
					</RNPDialog.Actions>
				)}
			</RNPDialog>
		</Portal>
	);
};

export default Dialog;
