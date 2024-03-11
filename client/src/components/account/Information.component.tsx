import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AVATAR_SIZE } from '../../screens/main/account/Account.screen';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';
import { IAccount } from '../../types';
import { Box, Rank } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface InformationProps extends Pick<IAccount.Account, 'name' | 'created_at'> {}

const Information = (props: InformationProps) => {
	const { name, created_at } = props;

	return (
		<Box style={[styles.container, stackStyles.row]}>
			<View style={[styles.detail]}>
				<Text variant="titleSmall" style={[{ fontWeight: 'bold' }]}>
					{name}
				</Text>
				<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
					Chưa Xếp hạng
				</Text>
				<Text
					variant="labelSmall"
					style={[{ fontStyle: 'italic', marginTop: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2 }]}
				>
					Đã tham gia vào {created_at}
				</Text>
			</View>
			<View style={[styles.rank, stackStyles.center]}>
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
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderBottomLeftRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
		borderBottomRightRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
	},
	detail: {
		width: '65%',
		paddingRight: MAIN_LAYOUT.SCREENS.ACCOUNT.INFORMATION.DETAIL_PADDING,
	},
	rank: {
		flex: 1,
	},
});

export default Information;
