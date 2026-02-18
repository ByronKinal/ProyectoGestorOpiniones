import { sequelize } from '../configs/db.js';
import { Role, UserRole } from '../src/auth/role.model.js';
import {
  User,
  UserProfile,
  UserEmail,
  UserPasswordReset,
} from '../src/users/user.model.js';
import { ALLOWED_ROLES, ADMIN_ROLE } from '../helpers/role-constants.js';
import { hashPassword } from '../utils/password-utils.js';

const seedRolesIfMissing = async () => {
  for (const name of ALLOWED_ROLES) {
    await Role.findOrCreate({
      where: { Name: name },
      defaults: { Name: name },
    });
  }
};

const createDefaultAdmin = async () => {
  const usersCount = await User.count();
  if (usersCount > 0) {
    console.log('Seed | Users already exist, skipping admin creation.');
    return;
  }

  const transaction = await sequelize.transaction();
  try {
    const hashedPassword = await hashPassword('Admin@1234!');

    const adminUser = await User.create(
      {
        Name: 'Admin',
        Surname: 'User',
        Username: 'admin',
        Email: 'admin@ksports.local',
        Password: hashedPassword,
        Status: true,
      },
      { transaction }
    );

    await UserProfile.create(
      {
        UserId: adminUser.Id,
        ProfilePicture: '',
        Phone: '00000000',
      },
      { transaction }
    );

    await UserEmail.create(
      {
        UserId: adminUser.Id,
        EmailVerified: true,
        EmailVerificationToken: null,
        EmailVerificationTokenExpiry: null,
      },
      { transaction }
    );

    await UserPasswordReset.create(
      {
        UserId: adminUser.Id,
        PasswordResetToken: null,
        PasswordResetTokenExpiry: null,
      },
      { transaction }
    );

    const adminRole = await Role.findOne(
      { where: { Name: ADMIN_ROLE } },
      { transaction }
    );

    if (!adminRole) {
      throw new Error('ADMIN_ROLE not found while creating admin user');
    }

    await UserRole.create(
      {
        UserId: adminUser.Id,
        RoleId: adminRole.Id,
      },
      { transaction }
    );

    await transaction.commit();
    console.log('Seed | Default admin user created.');
  } catch (error) {
    await transaction.rollback();
    console.error('Seed | Failed to create admin user:', error.message);
    throw error;
  }
};

export const seedInitialData = async () => {
  try {
    await seedRolesIfMissing();
    await createDefaultAdmin();
  } catch (error) {
    console.error('Seed | Error seeding initial data:', error.message);
    throw error;
  }
};
