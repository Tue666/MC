import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Resources } from '../redux/slices/account.slice';
import { IQuestion, IRoom } from '.';

export type MainTabList = {
	ConquerStack: undefined;
	Ranking: undefined;
	AccountStack: undefined;
};
export type MainConquerStackProps = BottomTabScreenProps<MainTabList, 'ConquerStack'>;
export type MainRankingProps = BottomTabScreenProps<MainTabList, 'Ranking'>;
export type MainAccountStackProps = BottomTabScreenProps<MainTabList, 'AccountStack'>;
export type MainLayoutProps = MainConquerStackProps | MainRankingProps | MainAccountStackProps;

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
};
export type AccountProps = StackScreenProps<AccountStackList, 'Account'>;

export type ConquerIdleMode = 'SINGLE' | 'MULTIPLE';
export type ConquerStackList = {
	Conquer: undefined;
	Waiting: {
		resource: Resources[keyof Resources];
		idleMode: ConquerIdleMode;
	};
	Prepare: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: IRoom.Room['mode'];
		idleMode: ConquerIdleMode;
	};
	LoadingQuestion: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: IRoom.Room['mode'];
	};
	Statistic: {
		client: IRoom.Room['clients'][number];
		isCorrect: boolean;
	};
	QuickMatch: {
		resource: Resources[keyof Resources];
		room: IRoom.Room;
		roomMode: IRoom.Room['mode'];
		question: IQuestion.Question;
	};
};
export type ConquerStackListKey = keyof ConquerStackList;
export type ConquerStackListParams<T extends ConquerStackListKey> = ConquerStackList[T];
export type ConquerProps = StackScreenProps<ConquerStackList, 'Conquer'>;
export type ConquerWaitingProps = StackScreenProps<ConquerStackList, 'Waiting'>;
export type ConquerPrepareProps = StackScreenProps<ConquerStackList, 'Prepare'>;
export type ConquerLoadingQuestionProps = StackScreenProps<ConquerStackList, 'LoadingQuestion'>;
export type ConquerStatisticProps = StackScreenProps<ConquerStackList, 'Statistic'>;
export type ConquerQuickMatchProps = StackScreenProps<ConquerStackList, 'QuickMatch'>;
