import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation } from '../../types';
import { RootState } from '../store';

export type Conversations = {
	[key: string]: IConversation.Conversation & {
		messages: IConversation.Message[];
	};
};

export interface ConversationState {
	conversations: Conversations;
}

export const initialState: ConversationState = {
	conversations: {},
};

export const slice = createSlice({
	name: 'conversation',
	initialState,
	reducers: {
		joinConversation(state: ConversationState, action: PayloadAction<IConversation.Conversation>) {
			const joinedConversation = action.payload;
			const { _id: joinedConversationId } = joinedConversation;

			state.conversations = {
				...state.conversations,
				[joinedConversationId]: {
					...joinedConversation,
					messages: [],
				},
			};
		},
		leaveConversation(
			state: ConversationState,
			action: PayloadAction<IConversation.Conversation['_id']>
		) {
			const leftConversationId = action.payload;
			const remainConversations = { ...state.conversations };
			delete remainConversations[leftConversationId];

			state.conversations = remainConversations;
		},
		updateConversation(state: ConversationState, action: PayloadAction<IConversation.Conversation>) {
			const conversation = action.payload;
			const { _id: conversationId } = conversation;

			state.conversations = {
				...state.conversations,
				[conversationId]: {
					...state.conversations[conversationId],
					...conversation,
				},
			};
		},
		updateMessageConversation(
			state: ConversationState,
			action: PayloadAction<{
				conversationId: IConversation.Conversation['_id'];
				message: IConversation.Message;
			}>
		) {
			const { conversationId, message } = action.payload;

			state.conversations = {
				...state.conversations,
				[conversationId]: {
					...state.conversations[conversationId],
					messages: [...state.conversations[conversationId].messages, message],
				},
			};
		},
	},
});

const { reducer, actions } = slice;
export const {
	joinConversation,
	leaveConversation,
	updateConversation,
	updateMessageConversation,
} = actions;
export const selectConversation = (state: RootState) => state.conversation;
export default reducer;
