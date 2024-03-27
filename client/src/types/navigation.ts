import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Resources } from '../redux/slices/account.slice';
import { IMatch, IQuestion, IResource, IRoom, ISchema } from '.';

export type MainTabList = {
	ConquerStack: undefined;
	Shop: undefined;
	Inventory: undefined;
	AccountStack: undefined;
};
export type MainConquerStackProps = BottomTabScreenProps<MainTabList, 'ConquerStack'>;
export type MainShopProps = BottomTabScreenProps<MainTabList, 'Shop'>;
export type MainInventoryProps = BottomTabScreenProps<MainTabList, 'Inventory'>;
export type MainAccountStackProps = BottomTabScreenProps<MainTabList, 'AccountStack'>;
export type MainLayoutProps =
	| MainConquerStackProps
	| MainShopProps
	| MainInventoryProps
	| MainAccountStackProps;

export type AuthenticationStackList = {
	Start: undefined;
	SignIn: undefined;
	SignUp: undefined;
};
export type AuthenticationStartProps = StackScreenProps<AuthenticationStackList, 'Start'>;
export type AuthenticationSignInProps = StackScreenProps<AuthenticationStackList, 'SignIn'>;
export type AuthenticationSignUpProps = StackScreenProps<AuthenticationStackList, 'SignUp'>;

export type AccountStackList = {
	Account: undefined;
	Setting: undefined;
};
export type AccountProps = StackScreenProps<AccountStackList, 'Account'>;
export type SettingProps = StackScreenProps<AccountStackList, 'Setting'>;

export type ConquerIdleMode = 'SINGLE' | 'MULTIPLE';
export type ConquerStackList = {
	Conquer: undefined;
	Waiting: {
		resource: Resources[keyof Resources];
		idleMode: ConquerIdleMode;
	};
	FindRoom: {
		resource: Resources[keyof Resources];
		roomMode: ISchema.RoomMode;
		idleMode: ConquerIdleMode;
		minToStart: IRoom.Room['minToStart'];
		maxCapacity: IRoom.Room['maxCapacity'];
	};
	Forming: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: ISchema.RoomMode;
		idleMode: ConquerIdleMode;
		minToStart: IRoom.Room['minToStart'];
	};
	Preparing: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: ISchema.RoomMode;
		idleMode: ConquerIdleMode;
	};
	LoadingQuestion: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: ISchema.RoomMode;
	};
	Statistic: {
		client: IMatch.Match['clients'][number];
		isClientAnswerCorrect: boolean;
		match: IMatch.Match;
		room: IRoom.Room;
	};
	QuickMatch: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: ISchema.RoomMode;
		question: IQuestion.Question;
	};
};
export type ConquerStackListKey = keyof ConquerStackList;
export type ConquerStackListParams<T extends ConquerStackListKey> = ConquerStackList[T];
export type ConquerProps = StackScreenProps<ConquerStackList, 'Conquer'>;
export type ConquerWaitingProps = StackScreenProps<ConquerStackList, 'Waiting'>;
export type ConquerFindRoomProps = StackScreenProps<ConquerStackList, 'FindRoom'>;
export type ConquerFormingProps = StackScreenProps<ConquerStackList, 'Forming'>;
export type ConquerPreparingProps = StackScreenProps<ConquerStackList, 'Preparing'>;
export type ConquerLoadingQuestionProps = StackScreenProps<ConquerStackList, 'LoadingQuestion'>;
export type ConquerStatisticProps = StackScreenProps<ConquerStackList, 'Statistic'>;
export type ConquerQuickMatchProps = StackScreenProps<ConquerStackList, 'QuickMatch'>;
