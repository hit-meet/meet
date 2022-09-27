import _ from 'lodash';

import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    INIT_REORDER_STATS,
    INIT_SEARCH,
    RESET_SEARCH_CRITERIA,
    TOGGLE_FACE_EXPRESSIONS,
    UPDATE_STATS
} from './actionTypes';

/**
 * The initial state of the feature speaker-stats.
 *
 * @type {Object}
 */
const INITIAL_STATE = {
    stats: {},
    isOpen: false,
    pendingReorder: true,
    criteria: null,
    showFaceExpressions: false
};

export interface ISpeakerStatsState {
    criteria: string | null;
    isOpen: boolean;
    pendingReorder: boolean;
    showFaceExpressions: boolean;
    stats: Object;
}

ReducerRegistry.register<ISpeakerStatsState>('features/speaker-stats',
(state = INITIAL_STATE, action): ISpeakerStatsState => {
    switch (action.type) {
    case INIT_SEARCH:
        return _updateCriteria(state, action);
    case UPDATE_STATS:
        return _updateStats(state, action);
    case INIT_REORDER_STATS:
        return _initReorderStats(state);
    case RESET_SEARCH_CRITERIA:
        return _updateCriteria(state, { criteria: null });
    case TOGGLE_FACE_EXPRESSIONS: {
        return {
            ...state,
            showFaceExpressions: !state.showFaceExpressions
        };
    }
    }

    return state;
});

/**
 * Reduces a specific Redux action INIT_SEARCH of the feature
 * speaker-stats.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @param {Action} action - The Redux action INIT_SEARCH to reduce.
 * @private
 * @returns {Object} The new state after the reduction of the specified action.
 */
function _updateCriteria(state: ISpeakerStatsState, { criteria }: { criteria: string | null; }) {
    return _.assign(
        {},
        state,
        { criteria }
    );
}

/**
 * Reduces a specific Redux action UPDATE_STATS of the feature
 * speaker-stats.
 * The speaker stats order is based on the stats object properties.
 * When updating without reordering, the new stats object properties are reordered
 * as the last in state, otherwise the order would be lost on each update.
 * If there was already a pending reorder, the stats object properties already have
 * the correct order, so the property order is not changing.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @param {Action} action - The Redux action UPDATE_STATS to reduce.
 * @private
 * @returns {Object} - The new state after the reduction of the specified action.
 */
function _updateStats(state: ISpeakerStatsState, { stats }: { stats: any; }) {
    const finalStats = state.pendingReorder ? stats : state.stats;

    if (!state.pendingReorder) {
        // Avoid reordering the speaker stats object properties
        const finalKeys = Object.keys(stats);

        finalKeys.forEach(newStatId => {
            finalStats[newStatId] = _.clone(stats[newStatId]);
        });

        Object.keys(finalStats).forEach(key => {
            if (!finalKeys.includes(key)) {
                delete finalStats[key];
            }
        });
    }

    return _.assign(
        {},
        state,
        {
            stats: { ...finalStats },
            pendingReorder: false
        }
    );
}

/**
 * Reduces a specific Redux action INIT_REORDER_STATS of the feature
 * speaker-stats.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @private
 * @returns {Object} The new state after the reduction of the specified action.
 */
function _initReorderStats(state: ISpeakerStatsState) {
    return _.assign(
        {},
        state,
        { pendingReorder: true }
    );
}
