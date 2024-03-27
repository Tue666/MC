const { AccountService } = require("../services/account.service");

class AccountController {
  async updateCover(req, res, next) {
    try {
      const cover = req.file;
      let { _id } = req.account;

      const account = await AccountService.updateWithFile(_id, [
        { field: "cover", value: cover },
      ]);

      res.status(200).json({
        msg: `Cập nhật cover [${account._id}] thành công!`,
        account: {
          _id,
          cover: account.cover,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const avatar = req.file;
      let { _id } = req.account;

      const account = await AccountService.updateWithFile(_id, [
        { field: "avatar", value: avatar },
      ]);

      res.status(200).json({
        msg: `Cập nhật avatar [${account._id}] thành công!`,
        account: {
          _id,
          avatar: account.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const accessToken = await AccountService.signIn(req.body);

      res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async signUp(req, res, next) {
    try {
      const account = await AccountService.signUp(req.body);

      res.status(201).json({
        msg: `Tạo tài khoản [${account.account_type}] thành công`,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    const authorizationHeader = req.headers["authorization"];
    const accessToken =
      authorizationHeader && authorizationHeader.split(" ")[1];

    try {
      const refreshedAccessToken = await AccountService.refreshToken(
        accessToken
      );

      res.status(200).json({
        accessToken: refreshedAccessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req, res, next) {
    try {
      res.status(200).json({
        verified: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      let { _id } = req.account;

      // Prioritize params
      if (req.params._id) {
        _id = req.params._id;
      }

      const profile = await AccountService.getProfile(_id);

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  AccountController: new AccountController(),
};
