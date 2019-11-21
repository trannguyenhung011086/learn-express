const roles = {
    guest: {
        allow: ['home:read'],
    },
    user: {
        allow: ['all:read', 'all:create', 'all:update'],
        inherits: ['guest'],
    },
    admin: {
        allow: ['all:delete'],
        inherits: ['user'],
    },
};

function allow(role, operation) {
    if (!roles[role]) return false;

    const $role = roles[role];

    if ($role.allow.includes(operation)) return true;

    if (!$role.inherits || $role.inherits.length < 1) return false;

    return $role.inherits.some(inheritRole => allow(inheritRole, operation));
}

module.exports = allow;
