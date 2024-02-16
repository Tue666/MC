import { useContext } from 'react';
import { SettingContext } from '../contexts/Setting.context';

const useSetting = () => useContext(SettingContext);

export default useSetting;
