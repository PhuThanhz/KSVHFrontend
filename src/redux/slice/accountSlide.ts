import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount } from '@/config/api';

/** ========================= FETCH ACCOUNT ========================= */
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data;
    }
);

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        address?: string;
        role: {
            id?: string;
            name?: string;
            permissions?: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[];
        };
    };
    employee?: {
        id: string;
        employeeCode: string;
        fullName: string;
        phone?: string;
        email?: string;
        positionName?: string;
    };
    activeMenu: string;
}

/** ========================= INITIAL STATE ========================= */
const initialState: IState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: '',
    user: {
        id: '',
        email: '',
        name: '',
        avatar: '',
        address: '',
        role: {
            id: '',
            name: '',
            permissions: [],
        },
    },
    employee: undefined,
    activeMenu: 'home',
};

/** ========================= SLICE ========================= */
export const accountSlide = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },

        /** Khi user login thành công */
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;

            state.user.id = action.payload?.id ?? '';
            state.user.email = action.payload?.email ?? '';
            state.user.name = action.payload?.name ?? '';
            state.user.avatar = action.payload?.avatar ?? '';
            state.user.address = action.payload?.address ?? '';

            state.user.role = action?.payload?.role ?? { id: '', name: '', permissions: [] };
            state.user.role.permissions = action?.payload?.role?.permissions ?? [];

            state.employee = action.payload?.employee ?? undefined;
        },

        setLogoutAction: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;

            state.user = {
                id: '',
                email: '',
                name: '',
                avatar: '',
                address: '',
                role: { id: '', name: '', permissions: [] },
            };

            state.employee = undefined;
        },

        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? '';
        },

        updateUserProfile: (state, action) => {
            if (action.payload) {
                if (action.payload.name) state.user.name = action.payload.name;
                if (action.payload.avatar) state.user.avatar = action.payload.avatar;

                state.user.address = action.payload.address ?? state.user.address;
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state) => {
            state.isAuthenticated = false;
            state.isLoading = true;
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;

                state.user.id = action.payload.user?.id ?? '';
                state.user.email = action.payload.user?.email ?? '';
                state.user.name = action.payload.user?.name ?? '';
                state.user.avatar = action.payload.user?.avatar ?? '';
                state.user.address = action.payload.user?.address ?? '';

                state.user.role = action.payload.user?.role ?? { id: '', name: '', permissions: [] };
                state.user.role.permissions = action.payload.user?.role?.permissions ?? [];

                state.employee = action.payload?.employee ?? undefined;
            }
        });

        builder.addCase(fetchAccount.rejected, (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
        });
    },
});

/** ========================= EXPORTS ========================= */
export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
    updateUserProfile,
} = accountSlide.actions;

export default accountSlide.reducer;
