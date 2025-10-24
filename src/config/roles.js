// An application depends on what roles it will have.

const allRoles = {
  client: ["common", "client"],
  employee: ["common", "commonAdmin", "employee"],
  admin: ["common", "commonAdmin", "admin"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
