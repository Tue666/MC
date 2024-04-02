import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AVATAR_SIZE } from '../../screens/main/account/Account.screen';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { IAccount } from '../../types';
import { Box, Name, Rank } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface InformationProps
	extends Pick<IAccount.Account, 'name' | 'experience_point' | 'created_at'> {}

const Information = (props: InformationProps) => {
	const { name, experience_point, created_at } = props;
	const { value, maxValue, level } = experience_point;

	return (
		<Box style={[styles.container, stackStyles.row]}>
			<View style={[styles.detail]}>
				<Name variant="titleSmall">{name}</Name>
				<Text variant="labelSmall" style={[typographyStyles.bold]}>
					Cấp độ: {level} ({value}/{maxValue})
				</Text>
				<Text variant="labelSmall" style={[typographyStyles.bold]}>
					Chưa Xếp hạng
				</Text>
				<Text
					variant="labelSmall"
					style={[typographyStyles.italic, { marginTop: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2 }]}
				>
					Đã tham gia vào {created_at}
				</Text>
			</View>
			<View style={[globalStyles.container, stackStyles.center]}>
				<Rank />
			</View>
		</Box>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
		paddingTop: AVATAR_SIZE / 2 + MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		paddingHorizontal: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		paddingBottom: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		borderRadius: 0,
	},
	detail: {
		width: '62%',
		paddingRight: MAIN_LAYOUT.SCREENS.ACCOUNT.INFORMATION.DETAIL_PADDING,
	},
});

export default Information;
