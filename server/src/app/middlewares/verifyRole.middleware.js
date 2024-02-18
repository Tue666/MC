const Buffer = require("buffer").Buffer;
const ValidateUtil = require("../../utils/validate.util");

/*
    Example for permission param & allow. Format: resource: operation[]
    {
        "1_VS_1": ["ENTER"],
        "5_VS_5": ["ENTER"],
    }
*/

const verifyRole = (permission) => (req, res, next) => {
  const accessibleResourcesHeader = req.headers["cm_ar"];
  if (!accessibleResourcesHeader)
    return res.status(403).json("Thông tin tài khoản không được phép!");

  let decodeAccessibleResources = Buffer.from(
    accessibleResourcesHeader,
    "base64"
  ).toString();
  try {
    decodeAccessibleResources = JSON.parse(decodeAccessibleResources);
  } catch (error) {
    return res.status(500).json("Thông tin tài khoản không được phép!");
  }

  for (const [resource, operations] of Object.entries(permission)) {
    if (
      decodeAccessibleResources[resource] === null ||
      decodeAccessibleResources[resource] === undefined
    ) {
      return res.status(403).json("Thông tin tài khoản không được phép!");
    }

    const accessibleOperations = decodeAccessibleResources[resource];
    const okIncludeAll = ValidateUtil.ensureIncludeAll(
      operations,
      accessibleOperations
    );
    if (!okIncludeAll) {
      return res.status(403).json("Thông tin tài khoản không được phép!");
    }

    next();
  }
};

module.exports = verifyRole;
