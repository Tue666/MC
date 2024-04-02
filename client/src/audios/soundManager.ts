import Sound from 'react-native-sound';

export type SoundName =
	| 'bell.mp3'
	| 'button_click.mp3'
	| 'correct.mp3'
	| 'defeat_voice.mp3'
	| 'incorrect.mp3'
	| 'join.mp3'
	| 'matching.mp3'
	| 'message_notification.mp3'
	| 'prepare.mp3'
	| 'quick_match_bg.mp3'
	| 'room_notification.mp3'
	| 'victory_bg.mp3'
	| 'victory_voice.mp3'
	| 'waiting_bg.mp3'
	| 'won.mp3';

export const SOUNDS: SoundName[] = [
	'bell.mp3',
	'button_click.mp3',
	'correct.mp3',
	'defeat_voice.mp3',
	'incorrect.mp3',
	'join.mp3',
	'matching.mp3',
	'message_notification.mp3',
	'prepare.mp3',
	'quick_match_bg.mp3',
	'room_notification.mp3',
	'victory_bg.mp3',
	'victory_voice.mp3',
	'waiting_bg.mp3',
	'won.mp3',
];

export interface SoundOptions {
	repeat?: boolean;
}

export type SoundMapping = {
	[K in SoundName]: Sound;
};

export type BlockedSounds = {
	[K in SoundName]: boolean;
};

const soundMapping = {} as SoundMapping;

class SoundManager {
	static initSounds(): void {
		for (let i = 0; i < SOUNDS.length; i++) {
			const soundName = SOUNDS[i];

			soundMapping[soundName] = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
				if (error) {
					console.log(`Failed to load sound ${soundName}: ${error.message}`);
					return;
				}
			});
		}
	}

	static isSoundAvailable(soundName: SoundName): boolean {
		return !!soundMapping[soundName] && soundMapping[soundName].isLoaded();
	}

	static playSound(soundName: SoundName, options?: SoundOptions): void {
		const sound = soundMapping[soundName];
		if (!SoundManager.isSoundAvailable(soundName)) return;

		if (options?.repeat) {
			sound.setNumberOfLoops(-1);
		}

		sound.play();
	}

	static stopSound(soundName: SoundName): void {
		const sound = soundMapping[soundName];
		if (!SoundManager.isSoundAvailable) return;

		sound.stop();
	}
}

export default SoundManager;
