import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { globalStyles } from '../../styles';
import { IConversation } from '../../types';
import { Box, Name } from '..';

const { MODAL } = ConstantConfig;

interface MessageProps {
	message: IConversation.Message;
	clientId: IConversation.Conversation['clients'][number]['_id'];
}

const Message = (props: MessageProps) => {
	const { message, clientId } = props;
	const { sender, content } = message;
	const theme = useTheme();
	const position = sender._id === clientId ? 'flex-end' : 'flex-start';
	const bgColor = sender._id === clientId ? theme.colors.primary : globalStyles.paper.backgroundColor;
	const textColor = sender._id === clientId ? theme.colors.onPrimary : theme.colors.onSurface;

	return (
		<View style={[styles.container]}>
			<View style={[{ alignItems: position }]}>
				<Name>{sender.name}</Name>
				<Box
					style={{
						backgroundColor: bgColor,
						padding: MODAL.CONVERSATION.PADDING,
					}}
				>
					<Text style={[{ color: textColor }]}>{content}</Text>
				</Box>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: MODAL.CONVERSATION.MARGIN / 2,
	},
});

export default Message;
