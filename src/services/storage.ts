
// Storage keys for localStorage
export const STORAGE_KEYS = {
  AUTH: {
    USER: 'auth.user',
    SESSION: 'auth.session',
    LAST_AUTH_TIME: 'auth.lastAuthTime'
  },
  UI_STATE: {
    LAST_MODAL_OPEN: 'ui.lastModalOpen',
    CURRENT_VIEW: 'ui.currentView',
    IS_DELETING: 'ui.isDeleting' // Add new key for deletion state
  },
  SETTINGS: {
    THEME: 'settings.theme',
    DISPLAY: 'settings.display',
    COMPANY: 'settings.company'
  },
  // Add new keys for CNAB processing
  CNAB240_OUTPUT_DIRECTORY: 'cnab240.outputDirectory',
  REMESSA_SEQUENCE: 'cnab240.remessaSequence'
};
