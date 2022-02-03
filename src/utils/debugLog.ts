import { DEBUG_HARDCODED_PARAMS } from '../HardcodedParams/DEBUG_HARDCODED_PARAMS';
import { DEV_MODE } from '../../webpackUtils/MODE';

/* eslint-disable */
export const debugLog = (...message: any) => {
	if (DEV_MODE || DEBUG_HARDCODED_PARAMS) {
		console.log(...message)
	}
}
