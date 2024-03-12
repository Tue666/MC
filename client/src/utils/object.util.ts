class ObjectUtil {
	static filterInclude(objectA: Object, objectB: Object): Object {
		const object = {};

		for (const [key, value] of Object.entries(objectA)) {
			if (objectB.hasOwnProperty(key)) object[key as keyof typeof objectA] = value;
		}

		return object;
	}

	static toFormData(object: Object): FormData {
		const formData = new FormData();

		Object.entries(object).forEach(([key, value]) => {
			if (value) {
				if (value instanceof Array) value.map((e) => formData.append(key, e));
				else formData.append(key, value);
			}
		});

		return formData;
	}
}

export default ObjectUtil;
