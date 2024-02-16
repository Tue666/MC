import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
	Start: undefined;
	SignIn: undefined;
	SignUp: undefined;
	Main: undefined;
};

export type Props = StackScreenProps<RootStackParamList>;
