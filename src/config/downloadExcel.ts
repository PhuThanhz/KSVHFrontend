export const downloadExcel = async (apiCall: any, fileName: string) => {
    const response = await apiCall;

    const blob = new Blob([response.data], {
        type:
            response.headers?.["content-type"] ??
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};
