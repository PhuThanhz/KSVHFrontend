import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false, // tránh reload khi focus lại tab
            refetchOnReconnect: true,    // tự refetch khi mạng reconnect
            staleTime: 1000 * 60 * 3, // cache tạm hợp lệ 3 phút
            gcTime: 1000 * 60 * 5,    //  giữ dữ liệu trong bộ nhớ 5 phút
        },
        mutations: {
            retry: false,
        },
    },
});
