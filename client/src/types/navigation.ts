import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { IOperation, IResource, IRoom } from '.';

export type MainTabList = {
	ConquerStack: undefined;
	Ranking: undefined;
	Account: undefined;
};
export type MainConquerStackProps = BottomTabScreenProps<MainTabList, 'ConquerStack'>;
export type MainRankingProps = BottomTabScreenProps<MainTabList, 'Ranking'>;
export type MainAccountProps = BottomTabScreenProps<MainTabList, 'Account'>;
export type MainLayoutProps = MainConquerStackProps | MainRankingProps | MainAccountProps;

export type AuthenticationStackList = {
	Start: undefined;
	SignIn: undefined;
	SignUp: undefined;
};
export type AuthenticationStartProps = StackScreenProps<AuthenticationStackList, 'Start'>;
export type AuthenticationSignInProps = StackScreenProps<AuthenticationStackList, 'SignIn'>;
export type AuthenticationSignUpProps = StackScreenProps<AuthenticationStackList, 'SignUp'>;

export type ConquerIdleMode = 'SINGLE' | 'MULTIPLE';
export type ConquerStackList = {
	Conquer: undefined;
	Waiting: {
		_id: IResource.Resource['_id'];
		name: IResource.Resource['name'];
		operations: IOperation.Operation['_id'][];
		idleMode: ConquerIdleMode;
	};
	Prepare: {
		room: IRoom.Room;
		_id: IResource.Resource['_id'];
		name: IResource.Resource['name'];
		idleMode: ConquerIdleMode;
	};
	Statistic: {
		client: IRoom.Room['clients'][number];
		isWinner: boolean;
	};
	FastHandEyes: {
		room: IRoom.Room;
		_id: IResource.Resource['_id'];
	};
};
export type ConquerStackListKey = keyof ConquerStackList;
export type ConquerStackListParams<T extends ConquerStackListKey> = ConquerStackList[T];
export type ConquerProps = StackScreenProps<ConquerStackList, 'Conquer'>;
export type ConquerWaitingProps = StackScreenProps<ConquerStackList, 'Waiting'>;
export type ConquerPrepareProps = StackScreenProps<ConquerStackList, 'Prepare'>;
export type ConquerStatisticProps = StackScreenProps<ConquerStackList, 'Statistic'>;
export type ConquerFastHandEyesProps = StackScreenProps<ConquerStackList, 'FastHandEyes'>;
