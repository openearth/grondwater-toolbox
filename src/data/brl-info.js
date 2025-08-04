export const initialFormData = {
  default: {
    main: {
      enabled: true,
      difference: '1',
      calculationLayer: 1,
      measure: 'stageDiff',
      menu: false,
    },
    primary: {
      enabled: false,
      difference: '1',
      calculationLayer: 1,
      measure: 'stageDiff',
      menu: false,
    },
    secondary: {
      enabled: false,
      difference: '1',
      calculationLayer: 1,
      measure: 'stageDiff',
      menu: false,
    },
    tertiary: {
      enabled: false,
      difference: '1',
      calculationLayer: 1,
      measure: 'stageDiff',
      menu: false,
    },
  },
};

export const calculationLayers = [ 1, 2 ];

export const levels = {
  main: 'Hoofd',
  primary: 'Primair',
  secondary: 'Secundair',
  tertiary: 'Tertiair',
};

export const measures = [
  { text: 'Rivierbodem (unit m)', value: 'stageDiff' },
  { text: 'Weerstand (unit m/d)', value: 'condDiff' },
  { text: 'Waterpeil (unit m)', value: 'rbotDiff' },
];

export const formDataInfo = {
  main: {
    stageDiff: {
      tooltipMessage:
        'Verandering in bodemhoogte van het hoofd watersysteem. Mogelijk range: (-5 m , 5 m)',
      ranges: [ -5, 5 ],
    },
    condDiff: {
      tooltipMessage:
        'Verandering in weerstand van het hoofd watersysteem. Mogelijk range: (-100 d , 100 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
      ranges: [ -100, 100 ],
    },
    rbotDiff: {
      tooltipMessage:
        'Verandering in waterhoogte van het hoofd watersysteem. Mogelijk range: (-5 m , 5 m)',
      ranges: [ -5, 5 ],
    },
  },
  primary: {
    stageDiff: {
      tooltipMessage:
        'Verandering in bodemhoogte van het primaire watersysteem. Mogelijk range: (-1 m , 1 m)',
      ranges: [ -1, 1 ],
    },
    condDiff: {
      tooltipMessage:
        'Verandering in weerstand van het primaire watersysteem. Mogelijk range: (-10 d , 10 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
      ranges: [ -10, 10 ],
    },
    rbotDiff: {
      tooltipMessage:
        'Verandering in waterhoogte van het primaire watersysteem. Mogelijk range: (-1 m , 1 m)',
      ranges: [ -1, 1 ],
    },
  },
  secondary: {
    stageDiff: {
      tooltipMessage:
        'Verandering in bodemhoogte van het secundaire watersysteem. Mogelijk range: (-1 m , 1 m)',
      ranges: [ -1, 1 ],
    },
    condDiff: {
      tooltipMessage:
        'Verandering in weerstand van het secundaire watersysteem. Mogelijk range: (-1 d , 1 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
      ranges: [ -1, 1 ],
    },
    rbotDiff: {
      tooltipMessage:
        'Verandering in waterhoogte van het secundaire watersysteem. Mogelijk range: (-1 m , 1 m)',
      ranges: [ -1, 1 ],
    },
  },
  tertiary: {
    stageDiff: {
      tooltipMessage:
        'Verandering in bodemhoogte van het tertiaire watersysteem. Mogelijk range: (-0.5 m , 0.5 m)',
      ranges: [ -0.5, 0.5 ],
    },
    condDiff: {
      tooltipMessage:
        'Verandering in weerstand van het tertiare watersysteem. Mogelijk range: (-1 d , 1 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
      ranges: [ -1, 1 ],
    },
    rbotDiff: {
      tooltipMessage:
        'Verandering in waterhoogte van het tertiare watersysteem. Mogelijk range: (-0.5 m , 0.5 m)',
      ranges: [ -0.5, 0.5 ],
    },
  },
};
