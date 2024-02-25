import Sound from 'react-native-sound';

export type SoundName =
	| 'button_click.mp3'
	| 'correct.mp3'
	| 'defeat.mp3'
	| 'incorrect.mp3'
	| 'participate.mp3'
	| 'prepare.mp3'
	| 'victory_bg.mp3'
	| 'victory.mp3';

export const SOUNDS: SoundName[] = [
	'button_click.mp3',
	'correct.mp3',
	'defeat.mp3',
	'incorrect.mp3',
	'participate.mp3',
	'prepare.mp3',
	'victory_bg.mp3',
	'victory.mp3',
];

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

	static playSound(soundName: SoundName, retries: number = 0): void {
		if (blockedSounds[soundName]) return;

		if (retries >= MAX_RETRY_LOAD_SOURCE) {
			console.log(`Sound ${soundName} has reached max retry to load. Stop play forever!`);
			blockedSounds[soundName] = true;
			return;
		}

		const sound = soundMapping[soundName];
		if (!sound || !sound.isLoaded()) {
			// SoundManager.loadSound(soundName)
			// 	.then((loadedSound) => {
			// 		SoundManager.playSound(loadedSound);
			// 	})
			// 	.catch((error) => {
			// 		retries++;
			// 		console.log(`Retry ${retries} times.`, error);
			// 		SoundManager.playSound(soundName, retries);
			// 	});
			return;
		}

		sound.play();
	}
}

export default SoundManager;
