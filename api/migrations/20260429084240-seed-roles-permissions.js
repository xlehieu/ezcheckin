module.exports = {
  async up(db) {
    // 🔥 1. Index
    await db
      .collection('permissions')
      .createIndex({ subject: 1, action: 1 }, { unique: true });

    await db.collection('roles').createIndex({ name: 1 }, { unique: true });

    // 🔥 2. Full permission list
    const permissions = [
      // USER
      { subject: 'USER', action: 'CREATE' },
      { subject: 'USER', action: 'READ' },
      { subject: 'USER', action: 'UPDATE' },
      { subject: 'USER', action: 'DELETE' },
      { subject: 'USER', action: 'RESTORE' },

      // SHIFT
      { subject: 'SHIFT', action: 'CREATE' },
      { subject: 'SHIFT', action: 'READ' },
      { subject: 'SHIFT', action: 'UPDATE' },
      { subject: 'SHIFT', action: 'DELETE' },
      { subject: 'SHIFT', action: 'RESTORE' },
      { subject: 'SHIFT', action: 'TOGGLE' },

      // ATTENDANCE
      { subject: 'ATTENDANCE', action: 'CREATE' }, // check-in
      { subject: 'ATTENDANCE', action: 'READ' },

      // BUSINESS
      { subject: 'BUSINESS', action: 'CREATE' },
      { subject: 'BUSINESS', action: 'READ' },
      { subject: 'BUSINESS', action: 'UPDATE' },
      { subject: 'BUSINESS', action: 'DELETE' },
    ];

    const permissionMap = {};

    // 🔥 3. Upsert permissions
    for (const perm of permissions) {
      const result = await db.collection('permissions').findOneAndUpdate(
        {
          subject: perm.subject,
          action: perm.action,
        },
        {
          $set: {
            ...perm,
            description: `${perm.action} ${perm.subject}`,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
          returnDocument: 'after',
        },
      );

      const key = `${perm.subject}:${perm.action}`;
      console.log(result);
      permissionMap[key] = result._id;
    }

    // 🔥 4. Roles
    const roles = [
      {
        name: 'ADMIN',
        description: 'Toàn quyền',
        permissions: Object.values(permissionMap),
      },
      {
        name: 'MANAGER',
        description: 'Quản lý',
        permissions: [
          // USER
          permissionMap['USER:READ'],
          permissionMap['USER:CREATE'],
          // SHIFT
          permissionMap['SHIFT:CREATE'],
          permissionMap['SHIFT:READ'],
          permissionMap['SHIFT:UPDATE'],
          permissionMap['SHIFT:TOGGLE'],

          // ATTENDANCE
          permissionMap['ATTENDANCE:READ'],

          // BUSINESS
          permissionMap['BUSINESS:READ'],
        ],
      },
      {
        name: 'EMPLOYEE',
        description: 'Nhân viên',
        permissions: [
          // ATTENDANCE
          permissionMap['ATTENDANCE:CREATE'], // check-in
          permissionMap['ATTENDANCE:READ'],

          // SHIFT
          permissionMap['SHIFT:READ'],
        ],
      },
    ];

    // 🔥 5. Upsert roles
    for (const role of roles) {
      await db.collection('roles').updateOne(
        { name: role.name },
        {
          $set: {
            description: role.description,
            permissions: role.permissions,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );
    }
  },

  async down(db) {
    await db.collection('roles').deleteMany({
      name: { $in: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    });

    await db.collection('permissions').deleteMany({
      subject: {
        $in: ['USER', 'SHIFT', 'ATTENDANCE', 'BUSINESS', 'AUTH'],
      },
    });
  },
};
