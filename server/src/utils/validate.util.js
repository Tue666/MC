class ValidateUtil {
  static ensureRequiredFields(...fields) {
    return fields.every((field) => field !== null && field !== undefined);
  }

  static ensureIncludeOne(value, targetValues) {
    return targetValues.indexOf(value) !== -1;
  }

  static ensureIncludeAll(values, targetValues) {
    return targetValues.every((value) =>
      ValidateUtil.ensureIncludeOne(value, values)
    );
  }
}

module.exports = ValidateUtil;
