import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useSocketClient from '../../../hooks/useSocketClient.hook';
import { MAIN_LAYOUT } from '../../../configs/constant';
import { ConquerWaitingProps } from '../../../types';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';

const LIMIT_CLIENT = 2;

const Waiting = ({ navigation, route }: ConquerWaitingProps) => {
	const theme = useTheme();
	const socketClient = useSocketClient();
	const [isParticipating, setIsParticipating] = useState(false);
	const [clientCount, setClientCount] = useState(0);
	const { profile } = useAppSelector(selectAccount);
	const { _id, name } = route.params;

	useEffect(() => {
		socketClient?.on('conquer:server-client(participate)', (clientCount: number) => {
			setClientCount(clientCount);
		});

		socketClient?.on('conquer:server-client(start-participate)', () => {
			navigation.navigate('FastHandEyes');
		});
	}, []);
	const onPressParticipate = () => {
		const data = {
			clientId: profile._id,
			resourceId: _id,
			limit: LIMIT_CLIENT,
		};

		if (isParticipating) {
			socketClient?.emit('conquer:client-server(cancel-participate)', data);
			setIsParticipating(false);
			return;
		}

		socketClient?.emit('conquer:client-server(participate)', data);
		setIsParticipating(true);
	};
	return (
		<View style={{ ...styles.container }}>
			<Text variant="titleLarge">{name}</Text>
			<View style={{ ...styles.border, borderColor: theme.colors.primary }}>
				<Avatar.Image
					size={MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
					source={require('../../../assets/logo.png')}
				/>
			</View>
			<TouchableOpacity
				onPress={onPressParticipate}
				style={{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }}
			>
				<Button
					loading={isParticipating}
					mode="contained"
					buttonColor={isParticipating ? theme.colors.error : theme.colors.primary}
					icon={() => (
						<Icon
							name={isParticipating ? 'cancel' : 'person-search'}
							size={20}
							color={isParticipating ? theme.colors.onError : theme.colors.onPrimary}
						/>
					)}
				>
					{isParticipating ? `Hủy (${clientCount}/${LIMIT_CLIENT})` : 'Tham Gia'}
				</Button>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	border: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.PADDING,
		borderRadius: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE,
		marginVertical: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.MARGIN_VERTICAL,
		borderWidth: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.BORDER_WIDTH,
	},
});

export default Waiting;
