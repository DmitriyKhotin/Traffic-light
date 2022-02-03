import { debugLog } from '../utils/debugLog';
import {createApp} from 'vue';
import Entry from './Entry/index.vue';

debugLog('start mount');

createApp(Entry).mount('#app');