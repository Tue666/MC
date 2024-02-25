import Sound from 'react-native-sound';

export type SoundName =
	| 'bell.mp3'
	| 'button_click.mp3'
	| 'correct.mp3'
	| 'defeat_voice.mp3'
	| 'incorrect.mp3'
	| 'join.mp3'
	| 'participate.mp3'
	| 'prepare.mp3'
	| 'quick_match_bg.mp3'
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
	'participate.mp3',
	'prepare.mp3',
	'quick_match_bg.mp3',
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
const blockedSounds = {} as BlockedSounds; // Prevent sounds that have reached max limit retry
const MAX_RETRY_LOAD_SOURCE = 3;

class SoundManager {
	static initSounds(): void {
		for (let i = 0; i < SOUNDS.length; i++) {
			const soundName = SOUNDS[i];
			console.log(`Start load sound ${soundName}`);

			soundMapping[soundName] = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
				if (error) {
					console.log(`Failed to load sound ${soundName}: ${error.message}`);
					return;
				}

				console.log(`Load sound ${soundName} success`);
			});
		}
	}

	static isSoundAvailable(soundName: SoundName): boolean {
		return !!soundMapping[soundName] && soundMapping[soundName].isLoaded();
	}

	static loadSound(soundName: SoundName): Promise<SoundName> {
		return new Promise((resolve, reject) => {
			soundMapping[soundName] = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
				if (error) {
					reject(`Failed to load sound ${soundName}: ${error.message}`);
					return;
				}

				console.log(`Load sound ${soundName} success`);
				resolve(soundName);
			});
		});
	}

	static findSound(soundName: SoundName): Sound | undefined {
		return soundMapping[soundName];
	}

	static playSound(soundName: SoundName, options?: SoundOptions, retries: number = 0): void {
		if (blockedSounds[soundName]) return;

		if (retries >= MAX_RETRY_LOAD_SOURCE) {
			console.log(`Sound ${soundName} has reached max retry to load. Stop play forever!`);
			blockedSounds[soundName] = true;
			return;
		}

		const sound = soundMapping[soundName];
		if (!SoundManager.isSoundAvailable(soundName)) {
			// SoundManager.loadSound(soundName)
			// 	.then((loadedSound) => {
			// 		SoundManager.playSound(loadedSound, options);
			// 	})
			// 	.catch((error) => {
			// 		retries++;
			// 		console.log(`Retry ${retries} times.`, error);
			// 		SoundManager.playSound(soundName, options, retries);
			// 	});
			return;
		}

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
