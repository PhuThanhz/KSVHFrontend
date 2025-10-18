import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount } from '@/config/api';

// Thunk gọi API lấy thông tin tài khoản
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data;
    }
);

interface IPermission {
    id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

interface IRole {
    id?: string;
    name?: string;
    permissions?: IPermission[];
}

interface IUser {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: IRole;
}

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: IUser;
    activeMenu: string;
}

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
        role: {
            id: '',
            name: '',
            permissions: [],
        },
    },
    activeMenu: 'home',
};

export const accountSlide = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.id || '';
            state.user.email = action.payload.email || '';
            state.user.name = action.payload.name || '';
            state.user.avatar = action.payload.avatar || '';
            state.user.role = action?.payload?.role || { id: '', name: '', permissions: [] };

            if (!action?.payload?.role) state.user.role = {};
            state.user.role.permissions = action?.payload?.role?.permissions ?? [];
        },
        setLogoutAction: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                id: '',
                email: '',
                name: '',
                avatar: '',
                role: {
                    id: '',
                    name: '',
                    permissions: [],
                },
            };
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state) => {
            state.isAuthenticated = false;
            state.isLoading = true;
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                const user = action.payload.user || {};
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user.id = user.id || '';
                state.user.email = user.email || '';
                state.user.name = user.name || '';
                state.user.avatar = user.avatar || '';
                state.user.role = user.role || { id: '', name: '', permissions: [] };

                if (!user.role) state.user.role = {};
                state.user.role.permissions = user.role?.permissions ?? [];
            }
        });

        builder.addCase(fetchAccount.rejected, (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
        });
    },
});

export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
} = accountSlide.actions;

export default accountSlide.reducer;
