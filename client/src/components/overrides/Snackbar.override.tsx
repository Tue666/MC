import { Snackbar as RNPSnackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { useSnackbar } from '../../hooks';
import { useAppSelector } from '../../redux/hooks';
import { selectSnackbar } from '../../redux/slices/snackbar.slice';

const { SNACKBAR } = ConstantConfig;

const Snackbar = () => {
	const { isOpen, content, duration, icon, color, action } = useAppSelector(selectSnackbar);
	const { closeSnackbar } = useSnackbar();

	return (
		<RNPSnackbar
			visible={isOpen}
			duration={duration}
			onDismiss={closeSnackbar}
			icon={icon ? () => <Icon name={icon} size={SNACKBAR.ICON_SIZE} color="#FFF" /> : undefined}
			onIconPress={
				icon
					? () => {
							if (icon === 'close') {
								closeSnackbar();
								return;
							}

							// Other here
					  }
					: undefined
			}
			action={action}
			style={{
				...(color && { backgroundColor: color }),
			}}
		>
			{content}
		</RNPSnackbar>
	);
};

export default Snackbar;
