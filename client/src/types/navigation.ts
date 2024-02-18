import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ConquerNavigateParams } from '../screens/main/conquer/Conquer.screen';

export type MainTabList = {
	ConquerStack: undefined;
	Ranking: undefined;
	Account: undefined;
};

export type MainTabProps = BottomTabScreenProps<MainTabList>;

export type AuthenticationStackList = {
	Start: undefined;
	SignIn: undefined;
	SignUp: undefined;
	Main: undefined;
};

export type AuthenticationStackProps = StackScreenProps<AuthenticationStackList>;

export type ConquerStackList = {
	Conquer: ConquerNavigateParams;
	Waiting: ConquerNavigateParams;
	FastHandEyes: ConquerNavigateParams;
};

export type ConquerStackListKeys = keyof ConquerStackList;

export type ConquerStackProps = StackScreenProps<ConquerStackList>;
