import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface SettingState {
	themeMode: ThemeMode;
}
interface SettingMethod {
	onChangeTheme: () => Promise<void>;
}

const initialState: SettingState & SettingMethod = {
	themeMode: 'light',
	onChangeTheme: () => Promise.resolve(),
};

const SettingContext = createContext(initialState);

const SettingProvider = (props: PropsWithChildren) => {
	const { children } = props;
	const [setting, setSetting] = useState<SettingState>({
		themeMode: 'light',
	});

	useEffect(() => {
		const initSetting = async () => {
			const themeMode = await AsyncStorage.getItem('TM');
			if (!themeMode) return;

			setSetting({
				themeMode: themeMode as ThemeMode,
			});
		};

		initSetting();
	}, []);

	const onChangeTheme = async (): Promise<void> => {
		const newThemeMode = setting.themeMode === 'light' ? 'dark' : 'light';

		setSetting({
			...setting,
			themeMode: newThemeMode,
		});
		await AsyncStorage.setItem('TM', newThemeMode);
	};
	return (
		<SettingContext.Provider
			value={{
				...setting,
				onChangeTheme,
			}}
		>
			{children}
		</SettingContext.Provider>
	);
};

export { SettingProvider, SettingContext };
