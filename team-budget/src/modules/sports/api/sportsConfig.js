export const sportsConfig = {
  badminton: {
    name: 'Badminton',
    icon: '🏸',
    expenseFields: {
      indoor: { 
        label: 'Indoor Court Fee', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      shuttlecock: { 
        label: 'Shuttlecock Cost', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      equipment: { 
        label: 'Equipment Cost', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      other: { 
        label: 'Other Expenses', 
        type: 'number', 
        category: 'misc',
        calculateTotal: true 
      }
    },
    dynamicFields: {
      shuttlecockUsed: {
        type: 'multi-select',
        label: 'Shuttlecocks Used',
        options: ['Aeroplane', 'Ling-Mei', 'Yonex AS-50', 'Yonex AS-40', 'Victor Gold', 'Li-Ning A+600', 'Custom'],
        calculateTotal: false // This is for tracking types, not costs
      }
    },
    defaultFields: ['indoor', 'shuttlecock', 'equipment', 'other']
  },
  cricket: {
    name: 'Cricket',
    icon: '🏏',
    expenseFields: {
      ground: { 
        label: 'Ground Rental', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      indoor: { 
        label: 'Indoor Facility Fee', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      tournaments: { 
        label: 'Tournament Fees', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      ball: { 
        label: 'Cricket Balls', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      batting: { 
        label: 'Batting Gear', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      protective: { 
        label: 'Protective Gear', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      umpire: { 
        label: 'Umpire Fees', 
        type: 'number', 
        category: 'personnel',
        calculateTotal: true 
      },
      custom: { 
        label: 'Custom Expense',
        type: 'custom-expense',
        fields: {
          name: { 
            type: 'text', 
            label: 'Expense Name', 
            placeholder: 'Enter expense name' 
          },
          amount: { 
            type: 'number', 
            label: 'Amount', 
            placeholder: '0.00'
          }
        },
        category: 'misc',
        calculateTotal: true
      },
      other: { 
        label: 'Other Expenses', 
        type: 'number', 
        category: 'misc',
        calculateTotal: true 
      }
    },
    dynamicFields: {
      ballType: {
        type: 'select',
        label: 'Ball Type',
        options: ['Leather', 'Tennis', 'Plastic', 'Other'],
        calculateTotal: false // Informational only
      }
    },
    defaultFields: ['ground', 'indoor', 'tournaments', 'ball', 'batting', 'protective', 'umpire', 'custom', 'other']
  },
  football: {
    name: 'Football',
    icon: '⚽',
    expenseFields: {
      field: { 
        label: 'Field Rental', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      balls: { 
        label: 'Football Cost', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      jersey: { 
        label: 'Jersey Cost', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      referee: { 
        label: 'Referee Fees', 
        type: 'number', 
        category: 'personnel',
        calculateTotal: true 
      },
      other: { 
        label: 'Other Expenses', 
        type: 'number', 
        category: 'misc',
        calculateTotal: true 
      }
    },
    dynamicFields: {},
    defaultFields: ['field', 'balls', 'jersey', 'referee', 'other']
  },
  basketball: {
    name: 'Basketball',
    icon: '🏀',
    expenseFields: {
      court: { 
        label: 'Court Rental', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      balls: { 
        label: 'Basketball Cost', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      jersey: { 
        label: 'Jersey Cost', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      other: { 
        label: 'Other Expenses', 
        type: 'number', 
        category: 'misc',
        calculateTotal: true 
      }
    },
    dynamicFields: {},
    defaultFields: ['court', 'balls', 'jersey', 'other']
  },
  tennis: {
    name: 'Tennis',
    icon: '🎾',
    expenseFields: {
      court: { 
        label: 'Court Rental', 
        type: 'number', 
        category: 'venue',
        calculateTotal: true 
      },
      balls: { 
        label: 'Tennis Balls', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      racket: { 
        label: 'Racket Maintenance', 
        type: 'number', 
        category: 'equipment',
        calculateTotal: true 
      },
      other: { 
        label: 'Other Expenses', 
        type: 'number', 
        category: 'misc',
        calculateTotal: true 
      }
    },
    dynamicFields: {
      ballType: {
        type: 'select',
        label: 'Ball Type',
        options: ['Regular', 'Championship', 'Practice', 'Other'],
        calculateTotal: false // Informational only
      }
    },
    defaultFields: ['court', 'balls', 'racket', 'other']
  }
};

export const expenseCategories = {
  venue: { 
    label: 'Venue Costs', 
    color: 'blue',
    description: 'Court rentals, field fees, facility costs'
  },
  equipment: { 
    label: 'Equipment', 
    color: 'green',
    description: 'Balls, gear, maintenance, supplies'
  },
  personnel: { 
    label: 'Personnel', 
    color: 'purple',
    description: 'Umpire fees, referee costs, staff payments'
  },
  misc: { 
    label: 'Miscellaneous', 
    color: 'gray',
    description: 'Other expenses, custom costs'
  }
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

// Helper to get expense fields that contribute to total calculation
export const getTotalCalculationFields = (sportKey) => {
  const config = getSportConfig(sportKey);
  const totalFields = [];
  
  Object.entries(config.expenseFields).forEach(([fieldKey, fieldConfig]) => {
    // Include fields that should be calculated in total
    // For custom-expense type, the fieldKey itself holds the amount value
    if (fieldConfig.calculateTotal !== false) {
      totalFields.push(fieldKey);
    }
  });
  
  return totalFields;
};

// Helper to get category totals for a specific expense
export const getCategoryTotals = (expense) => {
  const sportConfig = getSportConfig(expense.sport);
  const categoryTotals = {
    venue: 0,
    equipment: 0,
    personnel: 0,
    misc: 0
  };
  
  Object.entries(sportConfig.expenseFields).forEach(([fieldKey, fieldConfig]) => {
    const amount = expense[fieldKey] || 0;
    const category = fieldConfig.category || 'misc';
    
    if (fieldConfig.calculateTotal !== false) {
      categoryTotals[category] += amount;
    }
  });
  
  return categoryTotals;
};

// Default sport configuration (fallback)
export const defaultSportConfig = sportsConfig.badminton;