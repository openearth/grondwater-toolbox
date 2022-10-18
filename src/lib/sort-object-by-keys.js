/**
 * Sort an object by the 'objectOrder' object keys.
 */
export default (object) => {
  const objectOrder = {
    'ahn_f250': null,
    'top_sdl1_m_gt': null,
    'bot_sdl1_m_gt': null,
    'top_sdl2_m_gt': null,
    'bot_sdl2_m_gt': null,
    'top_sdl3_m_gt': null,
    'bot_sdl3_m_gt': null,
    'top_sdl4_m': null,
    'bot_sdl4_m': null,
    'top_sdl5_m': null,
    'bot_sdl5_m': null,
    'top_sdl6_m': null,
    'bot_sdl6_m': null,
    'top_geohydrologische_basis': null,
  };

  const sortedObject = JSON.stringify(Object.assign(objectOrder, object));

  return sortedObject;
};
