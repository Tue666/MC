class ObjectUtil {
	static filterInclude(objectA: Object, objectB: Object): Object {
		const object = {};

		for (const [key, value] of Object.entries(objectA)) {
			if (objectB.hasOwnProperty(key)) object[key as keyof typeof objectA] = value;
		}

		return object;
	}
}

export default ObjectUtil;
