import { createApp } from 'vue';

import { debugLog } from '../utils/debugLog';

import Entry from './Entry/index.vue';

debugLog('start mount');

createApp(Entry).mount('#app');
