import { useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { useAppSelector } from '../../redux/hooks';
import { Conversations, selectConversation } from '../../redux/slices/conversation.slice';
import { selectAccount } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { closeModal } from '../../utils';
import { Input, Message } from '..';

const { MODAL } = ConstantConfig;

export interface ConversationProps {}

const Conversation = (props: ConversationProps) => {
	const { conversations } = useAppSelector(selectConversation);
	const { profile } = useAppSelector(selectAccount);
	const messagesRef = useRef<FlatList | null>(null);
	const [conversationId, setConversationId] = useState<Conversations[number]['_id'] | null>(
		Object.values(conversations)[0]?._id ?? null
	);
	const theme = useTheme();

	useEffect(() => {
		const timeout = setTimeout(() => {
			onMessagesChange();
		}, 500);

		return () => {
			clearTimeout(timeout);

			messagesRef.current = null;
		};
	}, []);
	const onMessagesChange = () => {
		messagesRef.current?.scrollToEnd({ animated: true });
	};
	const onPressCloseModal = () => {
		SoundManager.playSound('button_click.mp3');
		closeModal();
	};
	return (
		<View style={[styles.container, globalStyles.paper, globalStyles.shadow]}>
			<View>
				<View style={[stackStyles.row, styles.header]}>
					<Text
						variant="labelMedium"
						style={[
							globalStyles.container,
							typographyStyles.bold,
							{ marginRight: MODAL.CONVERSATION.MARGIN / 2 },
						]}
					>
						{conversationId ? `Trò chuyện: ${conversations[conversationId].title}` : ''}
					</Text>
					<Icon
						name="close"
						size={MODAL.ICON_SIZE}
						color={theme.colors.onSurface}
						onPress={onPressCloseModal}
					/>
				</View>
				<Text variant="labelSmall" style={[typographyStyles.center, typographyStyles.italic]}>
					Các tin nhắn là tạm thời, không được lưu trữ và chỉ khả dụng khi online
				</Text>
			</View>
			{conversationId && (
				<>
					<FlatList
						ref={messagesRef}
						data={conversations[conversationId].messages}
						renderItem={({ item: message }) => (
							<Message key={message._id} message={message} clientId={profile._id} />
						)}
						keyExtractor={(message) => message._id}
						onContentSizeChange={onMessagesChange}
						style={[
							globalStyles.container,
							globalStyles.bg,
							{
								borderRadius: MODAL.CONVERSATION.BORDER_RADIUS,
							},
						]}
					/>
					<Input conversationId={conversationId} profile={profile} />
				</>
			)}
			{Object.keys(conversations).length <= 0 && (
				<View style={[globalStyles.container, stackStyles.center]}>
					<Icon name="sms" size={MODAL.CONVERSATION.ICON_SIZE} color={theme.colors.outline} />
					<Text variant="titleMedium">Chưa có cuộc trò chuyện nào.</Text>
					<Text variant="labelMedium" style={[typographyStyles.center]}>
						Tham gia trận đấu để tự động tạo cuộc trò chuyện nhé.
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width: MODAL.CONVERSATION.WIDTH,
		height: MODAL.CONVERSATION.HEIGHT,
		padding: MODAL.CONVERSATION.PADDING,
		borderRadius: MODAL.CONVERSATION.BORDER_RADIUS,
	},
	header: {
		padding: MODAL.CONVERSATION.PADDING / 2,
		justifyContent: 'space-between',
	},
});

export default Conversation;
