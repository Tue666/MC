class HelperUtil {
	static sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	static getCurrentTime() {
		return new Date().getTime();
	}
}

export default HelperUtil;
