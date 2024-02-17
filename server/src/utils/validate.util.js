class ValidateUtil {
  static ensureRequiredFields(...fields) {
    return fields.every((field) => field !== null && field !== undefined);
  }

  static ensureIncludeOne(value, values) {
    return values.indexOf(value) !== -1;
  }
}

module.exports = ValidateUtil;
