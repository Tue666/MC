import { DimensionValue, ScrollView } from 'react-native';
import { Button, Portal, Dialog as RNPDialog, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../../redux/hooks';
import { selectDialog } from '../../redux/slices/dialog.slice';
import { closeDialog } from '../../utils/dialog.util';
import { DIALOG } from '../../configs/constant';
import useGlobalStyles from '../../styles/global.style';

const Dialog = () => {
	const globalStyles = useGlobalStyles();
	const { isOpen, closable, icon, title, content, contentScrollable, actions } =
		useAppSelector(selectDialog);

	return (
		<Portal>
			<RNPDialog
				visible={isOpen}
				dismissable={closable}
				dismissableBackButton={closable}
				onDismiss={closeDialog}
				style={{ ...globalStyles.paper }}
			>
				{icon && <RNPDialog.Icon icon={() => <Icon name={icon} size={DIALOG.ICON_SIZE} />} />}
				{title && <RNPDialog.Title>{title}</RNPDialog.Title>}
				{!contentScrollable && (
					<RNPDialog.Content>
						<Text>{content}</Text>
					</RNPDialog.Content>
				)}
				{contentScrollable && (
					<RNPDialog.ScrollArea
						style={{
							maxHeight: DIALOG.SCROLL_CONTENT.MAX_HEIGHT as DimensionValue,
							padding: DIALOG.SCROLL_CONTENT.PADDING,
						}}
					>
						<ScrollView>
							<Text>{content}</Text>
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
