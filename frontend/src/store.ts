import { proxy } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import {Poll} from "@/pages/api/api.types";
import {getTokenPayload} from "@/shared/utils/utils";

export type AppState = {
    isLoading: boolean;
    poll?: Poll;
    accessToken?: string;
    user?: User
};

export type User = {
    id: string;
    name: string;
}

const state: AppState = proxy({
    isLoading: false,
});

const stateWithComputed: AppState = derive(
    {
        me: (get) => {
            const accessToken = get(state).accessToken;

            if (!accessToken) {
                return;
            }

            const token = getTokenPayload(accessToken);

            return {
                id: token.sub,
                name: token.name,
            };
        },
        isAdmin: (get) => {
            if (!get(state).user) {
                return false;
            }
            return get(state).user?.id === get(state).poll?.adminID;
        },
    },
    {
        proxy: state,
    }
);


const actions = {
    startLoading: (): void => {
        state.isLoading = true;
    },
    stopLoading: (): void => {
        state.isLoading = false;
    },
    initializePoll: (poll?: Poll): void => {
        state.poll = poll;
    },
    setPollAccessToken: (token?: string): void => {
        state.accessToken = token;
    },
};

subscribeKey(state, 'accessToken', () => {
    if (state.accessToken && state.poll) {
        localStorage.setItem('accessToken', state.accessToken);
    } else {
        localStorage.removeItem('accessToken');
    }
});

export type AppActions = typeof actions;

export { stateWithComputed as state, actions };