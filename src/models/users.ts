import { Sequelize, DataTypes } from 'sequelize';

export interface UserSchema {
  discord_id: any;
  guild_id: any;
  name: any;
  position: any;
  project: any;
  is_active?: any;
}

export default function Users(db: Sequelize) {
  const userSchema: UserSchema = {
    discord_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  };

  return db.define('users', userSchema);
}
