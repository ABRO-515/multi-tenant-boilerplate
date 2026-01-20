'use strict';

function toUserDto(user) {
  if (!user) return user;
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt
  };
}

module.exports = {
  toUserDto
};
