import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ConquerNavigateParams } from '../screens/main/conquer/Conquer.screen';

export type MainTabList = {
	ConquerStack: undefined;
	Ranking: undefined;
	Account: undefined;
};

export type MainConquerStackProps = BottomTabScreenProps<MainTabList, 'ConquerStack'>;
export type MainRankingProps = BottomTabScreenProps<MainTabList, 'Ranking'>;
export type MainAccountProps = BottomTabScreenProps<MainTabList, 'Account'>;

export type AuthenticationStackList = {
	Start: undefined;
	SignIn: undefined;
	SignUp: undefined;
};

export type AuthenticationStartProps = StackScreenProps<AuthenticationStackList, 'Start'>;
export type AuthenticationSignInProps = StackScreenProps<AuthenticationStackList, 'SignIn'>;
export type AuthenticationSignUpProps = StackScreenProps<AuthenticationStackList, 'SignUp'>;

export type ConquerStackList = {
	Conquer: undefined;
	Waiting: ConquerNavigateParams;
	FastHandEyes: undefined;
};

export type ConquerStackListKey = keyof ConquerStackList;

export type ConquerProps = StackScreenProps<ConquerStackList, 'Conquer'>;
export type ConquerWaitingProps = StackScreenProps<ConquerStackList, 'Waiting'>;
export type ConquerFastHandEyesProps = StackScreenProps<ConquerStackList, 'FastHandEyes'>;
