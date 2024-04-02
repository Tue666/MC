import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconButton, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { AccountState } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../styles';
import { IConversation } from '../../types';

const { BUTTON, MODAL } = ConstantConfig;

interface InputProps {
	conversationId: IConversation.Conversation['_id'];
	profile: AccountState['profile'];
}

const Input = (props: InputProps) => {
	const { conversationId, profile } = props;
	const [text, setText] = useState('');
	const theme = useTheme();
	const { socketClient } = useSocketClient();

	const onChangeInput = (value: string) => {
		setText(value);
	};
	const onPressSendMessage = () => {
		if (!text) return;

		socketClient?.emit('conversation:client-server(message-conversation)', {
			conversationId,
			message: {
				sender: profile,
				content: text,
			},
		});
		setText('');
	};
	return (
		<View style={[stackStyles.row, { padding: MODAL.CONVERSATION.PADDING / 2 }]}>
			<TextInput
				value={text}
				dense
				multiline
				underlineColor="transparent"
				activeUnderlineColor="transparent"
				contentStyle={[globalStyles.bg, { borderRadius: MODAL.CONVERSATION.BORDER_RADIUS }]}
				onChangeText={onChangeInput}
				style={[globalStyles.container, globalStyles.paper]}
			/>
			<TouchableOpacity onPress={onPressSendMessage}>
				<IconButton
					mode="contained"
					containerColor={theme.colors.primary}
					icon={() => <Icon name="send" size={BUTTON.ICON_SIZE} color={theme.colors.onPrimary} />}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default Input;
