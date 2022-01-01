"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdminLog extends Model {
    static associate({
      UserLog,
      PermissionLog,
      RoleLog,
      FlagLog,
      RequestLog,
      PointLog,
      AdminPermissionLog,
      AdminRoleLog,
    }) {
      this.belongsTo(UserLog, {
        foreignKey: "admin_id",
        targetKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.belongsToMany(PermissionLog, {
        through: AdminPermissionLog,
        foreignKey: "admin_id",
        sourceKey: "admin_id",
        otherKey: "perm_id",
        targetKey: "perm_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      this.belongsToMany(RoleLog, {
        through: AdminRoleLog,
        foreignKey: "admin_id",
        sourceKey: "admin_id",
        otherKey: "role_id",
        targetKey: "role_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      this.hasMany(FlagLog, {
        foreignKey: "approved_by",
        sourceKey: "admin_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.hasMany(PointLog, {
        foreignKey: "approved_by",
        sourceKey: "admin_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      this.hasMany(RequestLog, {
        foreignKey: "req_to",
        sourceKey: "admin_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    static createFromAdmin(Admin, action) {
      return this.create({
        _id: Admin._id,
        admin_id: Admin.admin_id,
        action: action,
      });
    }

    static bulkCreateFromAdmin(Admins, action) {
      return this.bulkCreate(
        Admins.map((Admin) => ({
          _id: Admin._id,
          admin_id: Admin.admin_id,
          action: action,
        }))
      );
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  AdminLog.init(
    {
      logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(1),
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "admins_log",
      initialAutoIncrement: 100,
      modelName: "AdminLog",
      indexes: [{ unique: false, fields: ["_id"] }],
    }
  );
  return AdminLog;
};
