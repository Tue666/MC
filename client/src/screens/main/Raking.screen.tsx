import { ScrollView } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Ranking = () => {
	const theme = useTheme();

	return (
		<ScrollView>
			{[...Array(20)].map((_, index) => {
				return (
					<Chip
						key={index}
						icon={() => <Icon name="home" size={20} color={theme.colors.onPrimary} />}
						onPress={() => {}}
						style={{ margin: 10, padding: 10, backgroundColor: theme.colors.primary }}
						textStyle={{ color: theme.colors.onPrimary }}
					>
						Example Chip
					</Chip>
				);
			})}
		</ScrollView>
	);
};

export default Ranking;
