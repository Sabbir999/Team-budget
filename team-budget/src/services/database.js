import { ref, set, get, update, remove, push, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase-config';

// Database paths
const DB_PATHS = {
  USERS: 'users',
  TEAMS: 'teams',
  PLAYERS: 'players',
  EXPENSES: 'expenses',
  PAYMENTS: 'payments',
  ATTENDANCE: 'attendance',
  SETTINGS: 'settings'
};

// User management
export const userAPI = {
  createUser: (userId, userData) => 
    set(ref(db, `${DB_PATHS.USERS}/${userId}`), {
      ...userData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }),
  
  getUser: (userId) => 
    get(ref(db, `${DB_PATHS.USERS}/${userId}`)),
  
  updateUser: (userId, updates) => 
    update(ref(db, `${DB_PATHS.USERS}/${userId}`), {
      ...updates,
      updatedAt: Date.now()
    }),

  getUserProfile: (userId) =>
    get(ref(db, `${DB_PATHS.USERS}/${userId}/profile`))
};

// Teams management
export const teamsAPI = {
  createTeam: (userId, teamData) => {
    const teamId = push(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}`)).key;
    const teamWithId = {
      ...teamData,
      id: teamId,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    console.log('💾 Creating team:', teamWithId);
    
    return set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}/${teamId}`), teamWithId)
      .then(() => {
        console.log('✅ Team created successfully');
        return teamWithId;
      })
      .catch((error) => {
        console.error('❌ Error creating team:', error);
        throw error;
      });
  },
  
  getTeams: (userId, callback) => {
    const teamsRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}`);
    console.log('📡 Setting up teams listener at path:', `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}`);
    
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📨 Teams snapshot received:', data);
      callback(snapshot);
    }, (error) => {
      console.error('❌ Teams listener error:', error);
    });
    
    return () => {
      console.log('🔴 Unsubscribing from teams listener');
      off(teamsRef, 'value', unsubscribe);
    };
  },
  
  getTeam: (userId, teamId) => 
    get(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}/${teamId}`)),
  
  updateTeam: (userId, teamId, updates) => {
    console.log('🔄 Updating team:', teamId, updates);
    return update(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}/${teamId}`), {
      ...updates,
      updatedAt: Date.now()
    })
    .then(() => {
      console.log('✅ Team updated successfully');
    })
    .catch((error) => {
      console.error('❌ Error updating team:', error);
      throw error;
    });
  },
  
  deleteTeam: (userId, teamId) => {
    console.log('🗑️ Deleting team:', teamId);
    return remove(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}/${teamId}`))
      .then(() => {
        console.log('✅ Team deleted successfully');
      })
      .catch((error) => {
        console.error('❌ Error deleting team:', error);
        throw error;
      });
  },

  // Get teams with filtering
  getTeamsBySport: (userId, sportType) => {
    const teamsRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.TEAMS}`);
    const sportQuery = query(teamsRef, orderByChild('sportType'), equalTo(sportType));
    return get(sportQuery);
  }
};

// Players management
export const playersAPI = {
  createPlayer: (userId, playerData) => {
    const playerId = push(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}`)).key;
    const playerWithId = {
      ...playerData,
      id: playerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: playerData.isActive !== undefined ? playerData.isActive : true
    };
    
    console.log('💾 Creating player:', playerWithId);
    
    return set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}/${playerId}`), playerWithId)
      .then(() => {
        console.log('✅ Player created successfully with ID:', playerId);
        return playerWithId;
      })
      .catch((error) => {
        console.error('❌ Error creating player:', error);
        throw error;
      });
  },
  
  getPlayers: (userId, callback) => {
    const playersRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}`);
    console.log('📡 Setting up players listener at path:', `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}`);
    
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📨 Players snapshot received - count:', data ? Object.keys(data).length : 0, 'data:', data);
      callback(snapshot);
    }, (error) => {
      console.error('❌ Players listener error:', error);
      callback({ val: () => null }); // Return empty snapshot on error
    });
    
    return () => {
      console.log('🔴 Unsubscribing from players listener');
      off(playersRef, 'value', unsubscribe);
    };
  },
  
  getPlayer: (userId, playerId) => 
    get(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}/${playerId}`)),
  
  updatePlayer: (userId, playerId, updates) => {
    console.log('🔄 Updating player:', playerId, updates);
    return update(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}/${playerId}`), {
      ...updates,
      updatedAt: Date.now()
    })
    .then(() => {
      console.log('✅ Player updated successfully');
    })
    .catch((error) => {
      console.error('❌ Error updating player:', error);
      throw error;
    });
  },
  
  deletePlayer: (userId, playerId) => {
    console.log('🗑️ Deleting player:', playerId);
    return remove(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}/${playerId}`))
      .then(() => {
        console.log('✅ Player deleted successfully');
      })
      .catch((error) => {
        console.error('❌ Error deleting player:', error);
        throw error;
      });
  },

  // Get players by team
  getPlayersByTeam: (userId, teamId, callback) => {
    const playersRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}`);
    const teamQuery = query(playersRef, orderByChild('teamId'), equalTo(teamId));
    
    const unsubscribe = onValue(teamQuery, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(teamQuery, 'value', unsubscribe);
  },

  // Get active players
  getActivePlayers: (userId, callback) => {
    const playersRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PLAYERS}`);
    const activeQuery = query(playersRef, orderByChild('isActive'), equalTo(true));
    
    const unsubscribe = onValue(activeQuery, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(activeQuery, 'value', unsubscribe);
  }
};

// Expenses management
export const expensesAPI = {
  createExpense: (userId, expenseData) => {
    const expenseId = push(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}`)).key;
    
    // Calculate totals
    const indoor = expenseData.indoor || 0;
    const shuttlecock = expenseData.shuttlecock || 0;
    const equipment = expenseData.equipment || 0;
    const other = expenseData.other || 0;
    const total = indoor + shuttlecock + equipment + other;
    const playersCount = expenseData.playersCount || 0;
    const perPerson = playersCount > 0 ? total / playersCount : 0;
    
    const expenseWithId = {
      ...expenseData,
      id: expenseId,
      indoor,
      shuttlecock,
      equipment,
      other,
      total,
      playersCount,
      perPerson: Math.round(perPerson * 100) / 100, // Round to 2 decimal places
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    console.log('💾 Creating expense:', expenseWithId);
    
    return set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}/${expenseId}`), expenseWithId)
      .then(() => {
        console.log('✅ Expense created successfully');
        return expenseWithId;
      })
      .catch((error) => {
        console.error('❌ Error creating expense:', error);
        throw error;
      });
  },
  
  getExpenses: (userId, callback) => {
    const expensesRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}`);
    console.log('📡 Setting up expenses listener');
    
    const unsubscribe = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📨 Expenses snapshot received - count:', data ? Object.keys(data).length : 0);
      callback(snapshot);
    }, (error) => {
      console.error('❌ Expenses listener error:', error);
    });
    
    return () => off(expensesRef, 'value', unsubscribe);
  },
  
  getExpense: (userId, expenseId) => 
    get(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}/${expenseId}`)),
  
  updateExpense: (userId, expenseId, updates) => {
    // Recalculate totals if relevant fields are updated
    if (updates.indoor || updates.shuttlecock || updates.equipment || updates.other || updates.playersCount) {
      const indoor = updates.indoor || 0;
      const shuttlecock = updates.shuttlecock || 0;
      const equipment = updates.equipment || 0;
      const other = updates.other || 0;
      const total = indoor + shuttlecock + equipment + other;
      const playersCount = updates.playersCount || 0;
      const perPerson = playersCount > 0 ? total / playersCount : 0;
      
      updates.total = total;
      updates.perPerson = Math.round(perPerson * 100) / 100;
    }
    
    console.log('🔄 Updating expense:', expenseId, updates);
    return update(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}/${expenseId}`), {
      ...updates,
      updatedAt: Date.now()
    })
    .then(() => {
      console.log('✅ Expense updated successfully');
    })
    .catch((error) => {
      console.error('❌ Error updating expense:', error);
      throw error;
    });
  },
  
  deleteExpense: (userId, expenseId) => {
    console.log('🗑️ Deleting expense:', expenseId);
    return remove(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}/${expenseId}`))
      .then(() => {
        console.log('✅ Expense deleted successfully');
      })
      .catch((error) => {
        console.error('❌ Error deleting expense:', error);
        throw error;
      });
  },

  // Get expenses by month and year
  getExpensesByPeriod: (userId, month, year, callback) => {
    const expensesRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.EXPENSES}`);
    const monthQuery = query(
      expensesRef, 
      orderByChild('monthYear'),
      equalTo(`${month}_${year}`)
    );
    
    const unsubscribe = onValue(monthQuery, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(monthQuery, 'value', unsubscribe);
  }
};

// Payments management
export const paymentsAPI = {
  createPayment: (userId, paymentData) => {
    const paymentId = push(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}`)).key;
    const paymentWithId = {
      ...paymentData,
      id: paymentId,
      amount: paymentData.amount || 0,
      status: paymentData.status || 'pending',
      paidAt: paymentData.paidAt || Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    console.log('💾 Creating payment:', paymentWithId);
    
    return set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}/${paymentId}`), paymentWithId)
      .then(() => {
        console.log('✅ Payment created successfully');
        return paymentWithId;
      })
      .catch((error) => {
        console.error('❌ Error creating payment:', error);
        throw error;
      });
  },
  
  getPayments: (userId, callback) => {
    const paymentsRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}`);
    console.log('📡 Setting up payments listener');
    
    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📨 Payments snapshot received - count:', data ? Object.keys(data).length : 0);
      callback(snapshot);
    }, (error) => {
      console.error('❌ Payments listener error:', error);
    });
    
    return () => off(paymentsRef, 'value', unsubscribe);
  },
  
  getPayment: (userId, paymentId) => 
    get(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}/${paymentId}`)),
  
  updatePayment: (userId, paymentId, updates) => {
    console.log('🔄 Updating payment:', paymentId, updates);
    return update(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}/${paymentId}`), {
      ...updates,
      updatedAt: Date.now()
    })
    .then(() => {
      console.log('✅ Payment updated successfully');
    })
    .catch((error) => {
      console.error('❌ Error updating payment:', error);
      throw error;
    });
  },
  
  deletePayment: (userId, paymentId) => {
    console.log('🗑️ Deleting payment:', paymentId);
    return remove(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}/${paymentId}`))
      .then(() => {
        console.log('✅ Payment deleted successfully');
      })
      .catch((error) => {
        console.error('❌ Error deleting payment:', error);
        throw error;
      });
  },

  // Get payments by player
  getPaymentsByPlayer: (userId, playerId, callback) => {
    const paymentsRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}`);
    const playerQuery = query(paymentsRef, orderByChild('playerId'), equalTo(playerId));
    
    const unsubscribe = onValue(playerQuery, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(playerQuery, 'value', unsubscribe);
  },

  // Get payments by status
  getPaymentsByStatus: (userId, status, callback) => {
    const paymentsRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.PAYMENTS}`);
    const statusQuery = query(paymentsRef, orderByChild('status'), equalTo(status));
    
    const unsubscribe = onValue(statusQuery, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(statusQuery, 'value', unsubscribe);
  }
};

// Attendance management
export const attendanceAPI = {
  recordAttendance: (userId, attendanceData) => {
    const attendanceId = push(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.ATTENDANCE}`)).key;
    const attendanceWithId = {
      ...attendanceData,
      id: attendanceId,
      recordedAt: Date.now(),
      createdAt: Date.now()
    };
    
    return set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.ATTENDANCE}/${attendanceId}`), attendanceWithId);
  },
  
  getAttendance: (userId, callback) => {
    const attendanceRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.ATTENDANCE}`);
    
    const unsubscribe = onValue(attendanceRef, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(attendanceRef, 'value', unsubscribe);
  },

  // Get attendance by player and date range
  getAttendanceByPlayer: (userId, playerId, startDate, endDate, callback) => {
    const attendanceRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.ATTENDANCE}`);
    const playerQuery = query(
      attendanceRef, 
      orderByChild('playerId_date'),
      equalTo(`${playerId}_${startDate}`)
    );
    
    const unsubscribe = onValue(playerQuery, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(playerQuery, 'value', unsubscribe);
  }
};

// Settings management
export const settingsAPI = {
  saveSettings: (userId, settings) => 
    set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.SETTINGS}`), {
      ...settings,
      updatedAt: Date.now()
    }),
  
  getSettings: (userId, callback) => {
    const settingsRef = ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.SETTINGS}`);
    
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      callback(snapshot);
    });
    
    return () => off(settingsRef, 'value', unsubscribe);
  }
};

// Utility functions
export const databaseUtils = {
  // Check if data exists at path
  exists: (path) => 
    get(ref(db, path)).then(snapshot => snapshot.exists()),

  // Get multiple items by IDs
  getMultiple: (path, ids) => 
    Promise.all(ids.map(id => get(ref(db, `${path}/${id}`)))),

  // Batch update multiple items
  batchUpdate: (updates) => 
    update(ref(db), updates),

  // Delete multiple items
  batchDelete: (paths) => {
    const updates = {};
    paths.forEach(path => {
      updates[path] = null;
    });
    return update(ref(db), updates);
  }
};

// Export all APIs as default object
export default {
  userAPI,
  teamsAPI,
  playersAPI,
  expensesAPI,
  paymentsAPI,
  attendanceAPI,
  settingsAPI,
  databaseUtils,
  DB_PATHS
};