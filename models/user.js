import { DataTypes, Model } from "sequelize";

/**
 * Ініціалізує модель User для таблиці 'users'.
 * Поля:
 * - password: обов'язковий рядок
 * - email: обов'язковий унікальний рядок
 * - subscription: ENUM зі значеннями starter|pro|business (default: starter)
 * - token: рядок, за замовчуванням null
 */
export function initUserModel(sequelize) {
  class User extends Model {}

  User.init(
    {
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      subscription: {
        type: DataTypes.ENUM,
        values: ["starter", "pro", "business"],
        defaultValue: "starter",
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      avatarURL: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      verify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: false,
    }
  );

  return User;
}
