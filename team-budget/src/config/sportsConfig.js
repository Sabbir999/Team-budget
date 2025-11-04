export const sportsConfig = {
  badminton: {
    name: 'Badminton',
    icon: '🏸',
    expenseFields: {
      indoor: { label: 'Indoor Court Fee', type: 'number', category: 'venue' },
      shuttlecock: { label: 'Shuttlecock Cost', type: 'number', category: 'equipment' },
      equipment: { label: 'Equipment Cost', type: 'number', category: 'equipment' },
      other: { label: 'Other Expenses', type: 'number', category: 'misc' }
    },
    dynamicFields: {
      shuttlecockUsed: {
        type: 'multi-select',
        label: 'Shuttlecocks Used',
        options: ['Aeroplane', 'Ling-Mei', 'Yonex AS-50', 'Yonex AS-40', 'Victor Gold', 'Li-Ning A+600', 'Custom']
      }
    },
    defaultFields: ['indoor', 'shuttlecock', 'equipment', 'other']
  },
  cricket: {
    name: 'Cricket',
    icon: '🏏',
    expenseFields: {
      ground: { label: 'Ground Rental', type: 'number', category: 'venue' },
      ball: { label: 'Cricket Balls', type: 'number', category: 'equipment' },
      batting: { label: 'Batting Gear', type: 'number', category: 'equipment' },
      protective: { label: 'Protective Gear', type: 'number', category: 'equipment' },
      umpire: { label: 'Umpire Fees', type: 'number', category: 'personnel' },
      other: { label: 'Other Expenses', type: 'number', category: 'misc' }
    },
    dynamicFields: {
      ballType: {
        type: 'select',
        label: 'Ball Type',
        options: ['Leather', 'Tennis', 'Plastic', 'Other']
      }
    },
    defaultFields: ['ground', 'ball', 'batting', 'protective', 'umpire', 'other']
  },
  football: {
    name: 'Football',
    icon: '⚽',
    expenseFields: {
      field: { label: 'Field Rental', type: 'number', category: 'venue' },
      balls: { label: 'Football Cost', type: 'number', category: 'equipment' },
      jersey: { label: 'Jersey Cost', type: 'number', category: 'equipment' },
      referee: { label: 'Referee Fees', type: 'number', category: 'personnel' },
      other: { label: 'Other Expenses', type: 'number', category: 'misc' }
    },
    defaultFields: ['field', 'balls', 'jersey', 'referee', 'other']
  },
  basketball: {
    name: 'Basketball',
    icon: '🏀',
    expenseFields: {
      court: { label: 'Court Rental', type: 'number', category: 'venue' },
      balls: { label: 'Basketball Cost', type: 'number', category: 'equipment' },
      jersey: { label: 'Jersey Cost', type: 'number', category: 'equipment' },
      other: { label: 'Other Expenses', type: 'number', category: 'misc' }
    },
    defaultFields: ['court', 'balls', 'jersey', 'other']
  },
  tennis: {
    name: 'Tennis',
    icon: '🎾',
    expenseFields: {
      court: { label: 'Court Rental', type: 'number', category: 'venue' },
      balls: { label: 'Tennis Balls', type: 'number', category: 'equipment' },
      racket: { label: 'Racket Maintenance', type: 'number', category: 'equipment' },
      other: { label: 'Other Expenses', type: 'number', category: 'misc' }
    },
    dynamicFields: {
      ballType: {
        type: 'select',
        label: 'Ball Type',
        options: ['Regular', 'Championship', 'Practice', 'Other']
      }
    },
    defaultFields: ['court', 'balls', 'racket', 'other']
  }
};

export const expenseCategories = {
  venue: { label: 'Venue Costs', color: 'blue' },
  equipment: { label: 'Equipment', color: 'green' },
  personnel: { label: 'Personnel', color: 'purple' },
  misc: { label: 'Miscellaneous', color: 'gray' }
};

// Helper function to get sport by key
export const getSportConfig = (sportKey) => {
  return sportsConfig[sportKey] || sportsConfig.badminton;
};

// Helper to get all sports for dropdowns
export const getSportsList = () => {
  return Object.entries(sportsConfig).map(([key, config]) => ({
    key,
    name: config.name,
    icon: config.icon
  }));
};