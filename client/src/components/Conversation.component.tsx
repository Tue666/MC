import { useEffect } from 'react';
import { SoundManager } from '../audios';
import { useSocketClient } from '../hooks';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectAccount } from '../redux/slices/account.slice';
import { openDialog } from '../utils';
import { IConversation } from '../types';
import {
	joinConversation,
	leaveConversation,
	updateConversation,
	updateMessageConversation,
} from '../redux/slices/conversation.slice';

const Conversation = () => {
	const { profile } = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();
	const { socketClient } = useSocketClient();

	useEffect(() => {
		const onJoinConversationEvent = (
			joinedConversation: IConversation.Conversation,
			client: IConversation.Conversation['clients'][number]
		) => {
			const isJoinedClient = profile._id === client._id;
			if (isJoinedClient) {
				dispatch(joinConversation(joinedConversation));
				return;
			}

			dispatch(updateConversation(joinedConversation));
		};
		socketClient?.on('conversation:server-client(join-conversation)', onJoinConversationEvent);

		const onLeaveConversationEvent = (
			leftConversation: IConversation.Conversation,
			client: IConversation.Conversation['clients'][number]
		) => {
			const isLeftClient = profile._id === client._id;
			if (isLeftClient) {
				dispatch(leaveConversation(leftConversation._id));
				return;
			}

			dispatch(updateConversation(leftConversation));
		};
		socketClient?.on('conversation:server-client(leave-conversation)', onLeaveConversationEvent);

		const onMessageConversation = (
			conversationId: IConversation.Conversation['_id'],
			message: IConversation.Message
		) => {
			SoundManager.playSound('message_notification.mp3');
			dispatch(updateMessageConversation({ conversationId, message }));
		};
		socketClient?.on('conversation:server-client(message-conversation)', onMessageConversation);

		const onErrorMessageConversation = (error: string) => {
			openDialog({
				title: '[Trò chuyện] Lỗi',
				content: error,
			});
		};
		socketClient?.on(
			'[ERROR]conversation:server-client(message-conversation)',
			onErrorMessageConversation
		);

		return () => {
			socketClient?.off('conversation:server-client(join-conversation)', onJoinConversationEvent);
			socketClient?.off('conversation:server-client(leave-conversation)', onLeaveConversationEvent);
			socketClient?.off('conversation:server-client(message-conversation)', onMessageConversation);
			socketClient?.off(
				'[ERROR]conversation:server-client(message-conversation)',
				onErrorMessageConversation
			);
		};
	}, [profile?._id]);
	return null;
};

export default Conversation;
