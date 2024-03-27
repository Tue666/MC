class StringUtil {
  static toStringID(value) {
    if (!value) return;

    return StringUtil.removeVietnamese(value).replace(/ /g, "_").toUpperCase();
  }

  static toArray(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string" || value instanceof String) {
      return value.split(",");
    }

    return [];
  }

  static randomGenerate(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  static capitalize(text) {
    return text
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  }

  static removeVietnamese(text) {
    const diacriticMap = {
      à: "a",
      á: "a",
      ả: "a",
      ã: "a",
      ạ: "a",
      ă: "a",
      ằ: "a",
      ắ: "a",
      ẳ: "a",
      ẵ: "a",
      ặ: "a",
      â: "a",
      ầ: "a",
      ấ: "a",
      ẩ: "a",
      ẫ: "a",
      ậ: "a",
      è: "e",
      é: "e",
      ẻ: "e",
      ẽ: "e",
      ẹ: "e",
      ê: "e",
      ề: "e",
      ế: "e",
      ể: "e",
      ễ: "e",
      ệ: "e",
      ì: "i",
      í: "i",
      ỉ: "i",
      ĩ: "i",
      ị: "i",
      ò: "o",
      ó: "o",
      ỏ: "o",
      õ: "o",
      ọ: "o",
      ô: "o",
      ồ: "o",
      ố: "o",
      ổ: "o",
      ỗ: "o",
      ộ: "o",
      ơ: "o",
      ờ: "o",
      ớ: "o",
      ở: "o",
      ỡ: "o",
      ợ: "o",
      ù: "u",
      ú: "u",
      ủ: "u",
      ũ: "u",
      ụ: "u",
      ư: "u",
      ừ: "u",
      ứ: "u",
      ử: "u",
      ữ: "u",
      ự: "u",
      ỳ: "y",
      ý: "y",
      ỷ: "y",
      ỹ: "y",
      ỵ: "y",
      đ: "d",
      À: "A",
      Á: "A",
      Ả: "A",
      Ã: "A",
      Ạ: "A",
      Ă: "A",
      Ằ: "A",
      Ắ: "A",
      Ẳ: "A",
      Ẵ: "A",
      Ặ: "A",
      Â: "A",
      Ầ: "A",
      Ấ: "A",
      Ẩ: "A",
      Ẫ: "A",
      Ậ: "A",
      È: "E",
      É: "E",
      Ẻ: "E",
      Ẽ: "E",
      Ẹ: "E",
      Ê: "E",
      Ề: "E",
      Ế: "E",
      Ể: "E",
      Ễ: "E",
      Ệ: "E",
      Ì: "I",
      Í: "I",
      Ỉ: "I",
      Ĩ: "I",
      Ị: "I",
      Ò: "O",
      Ó: "O",
      Ỏ: "O",
      Õ: "O",
      Ọ: "O",
      Ô: "O",
      Ồ: "O",
      Ố: "O",
      Ổ: "O",
      Ỗ: "O",
      Ộ: "O",
      Ơ: "O",
      Ờ: "O",
      Ớ: "O",
      Ở: "O",
      Ỡ: "O",
      Ợ: "O",
      Ù: "U",
      Ú: "U",
      Ủ: "U",
      Ũ: "U",
      Ụ: "U",
      Ư: "U",
      Ừ: "U",
      Ứ: "U",
      Ử: "U",
      Ữ: "U",
      Ự: "U",
      Ỳ: "Y",
      Ý: "Y",
      Ỷ: "Y",
      Ỹ: "Y",
      Ỵ: "Y",
      Đ: "D",
    };

    return text.replace(
      /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/g,
      (match) => diacriticMap[match] || match
    );
  }
}

module.exports = StringUtil;
