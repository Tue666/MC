import { Image, StyleSheet, View } from 'react-native';
import { Text, TextProps } from 'react-native-paper';
import { APIConfig } from '../configs';

const { APP } = APIConfig;

interface NameProps extends TextProps<never> {}

const Name = (props: NameProps) => {
	const { children } = props;

	return (
		<View style={[styles.container]}>
			<Image
				source={{ uri: `${APP.image_storage.url}/app/top-name.png` }}
				style={[
					{
						width: 110,
						height: 25,
						objectFit: 'contain',
						position: 'absolute',
						top: -15,
					},
				]}
			/>
			<Text variant="titleSmall" style={[{ fontWeight: 'bold' }]}>
				{children}
			</Text>
			<Image
				source={{ uri: `${APP.image_storage.url}/app/bottom-name.png` }}
				style={[
					{
						width: 110,
						height: 25,
						objectFit: 'contain',
						position: 'absolute',
						bottom: -20,
					},
				]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginVertical: 15,
	},
});

export default Name;
