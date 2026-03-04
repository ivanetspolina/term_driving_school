const RegularGenerator = require('./RegularGenerator');
const TCrossGenerator = require('./TCrossGenerator');
const RoundGenerator = require('./RoundGenerator');

/**
 * Фабрика генераторів питань за типом дороги
 * @param {'regular'|'t_cross'|'round'} roadType
 * @returns {RegularGenerator|TCrossGenerator|RoundGenerator}
 */
function createGenerator(roadType = 'regular') {
  switch (roadType) {
    case 't_cross':
      return new TCrossGenerator();
    case 'round':
      return new RoundGenerator();
    case 'regular':
    default:
      return new RegularGenerator();
  }
}

module.exports = {
  createGenerator,
};

