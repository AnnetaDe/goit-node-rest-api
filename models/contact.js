import { DataTypes, Model } from "sequelize";
import { initUserModel } from "./user.js";

let Contact;

export function initContactModel(sq) {
  if (Contact) return Contact;
  if (!sq) throw new Error("Sequelize instance is required for initContactModel");

  class ContactModel extends Model {}

  ContactModel.init(
    {
      name: {type: DataTypes.STRING, allowNull: false},
      email: {type: DataTypes.STRING, allowNull: false, validate: {isEmail: true}},
      phone: {type: DataTypes.STRING, allowNull: false},
      favorite: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize: sq,
      modelName: "Contact",
      tableName: "contacts",
      timestamps: true,
      indexes: [
        {
          fields: ['owner'],
        }
      ]
    }
  );

  const User = sq.models.User || initUserModel(sq);
  ContactModel.belongsTo(User, {foreignKey: 'owner', as: 'user'});
  User.hasMany(ContactModel, {foreignKey: 'owner', as: 'contacts'});

  Contact = ContactModel;
  return Contact;
}

export {Contact};
