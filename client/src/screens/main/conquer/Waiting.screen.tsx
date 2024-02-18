import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConquerStackProps } from '../../../types';

const Waiting = ({ navigation, route }: ConquerStackProps) => {
	const theme = useTheme();
	const { name } = route.params;

	return (
		<View style={{ ...styles.container }}>
			<Text variant="titleLarge">{name}</Text>
			<View style={{ ...styles.border, borderColor: theme.colors.primary }}>
				<Avatar.Image size={250} source={require('../../../assets/logo.png')} />
			</View>
			<TouchableOpacity style={{ width: 250 }}>
				<Button
					mode="contained"
					icon={() => <Icon name="person-search" size={20} color={theme.colors.onPrimary} />}
				>
					Ghép
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
		padding: 10,
		borderRadius: 250,
		margin: 50,
		borderWidth: 5,
	},
});

export default Waiting;
