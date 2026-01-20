'use strict';

function toUserDto(user) {
  if (!user) return user;
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role
  };
}

function toLoginDto(result) {
  return {
    accessToken: result.accessToken,
    expiresIn: result.expiresIn,
    refreshToken: result.refreshToken,
    refreshExpiresIn: result.refreshExpiresIn,
    user: toUserDto(result.user)
  };
}

module.exports = {
  toUserDto,
  toLoginDto
};
