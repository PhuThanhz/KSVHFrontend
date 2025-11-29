// // src/components/common/UploadImage.tsx
// import { Upload, Modal, message } from "antd";
// import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import type { UploadFile, UploadProps } from "antd";
// import { useState, useCallback, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { callUploadSingleFile, callUploadMultipleFiles } from "@/config/api";

// interface IUploadImageProps {
//     folder: string;             // tên thư mục (vd: "company", "device")
//     multiple?: boolean;         // cho phép nhiều ảnh
//     maxCount?: number;          // số lượng tối đa
//     defaultFiles?: string[];    // danh sách file ban đầu (vd: khi edit)
//     onChangeFiles?: (files: UploadFile[]) => void;
// }

// const UploadImage = ({
//     folder,
//     multiple = false,
//     maxCount = 1,
//     defaultFiles = [],
//     onChangeFiles,
// }: IUploadImageProps) => {
//     const [fileList, setFileList] = useState<UploadFile[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewImage, setPreviewImage] = useState("");
//     const [previewTitle, setPreviewTitle] = useState("");

//     // init default files
//     useEffect(() => {
//         if (defaultFiles.length > 0) {
//             setFileList(
//                 defaultFiles.map((f) => ({
//                     uid: uuidv4(),
//                     name: f,
//                     status: "done",
//                     url: `${import.meta.env.VITE_BACKEND_URL}/storage/${folder}/${f}`,
//                 }))
//             );
//         }
//     }, [defaultFiles, folder]);

//     const handlePreview = useCallback((file: UploadFile) => {
//         if (file.url) {
//             setPreviewImage(file.url);
//             setPreviewOpen(true);
//             setPreviewTitle(file.name);
//         }
//     }, []);

//     const customRequest = useCallback(
//         async ({ file, onSuccess, onError }) => {
//             try {
//                 setLoading(true);
//                 const res = multiple
//                     ? await callUploadMultipleFiles([file], folder)
//                     : await callUploadSingleFile(file, folder);

//                 if (res?.data) {
//                     const uploadedFiles = Array.isArray(res.data)
//                         ? res.data.map((f) => ({
//                             uid: uuidv4(),
//                             name: f.fileName,
//                             status: "done",
//                             url: `${import.meta.env.VITE_BACKEND_URL}/storage/${folder}/${f.fileName}`,
//                         }))
//                         : [
//                             {
//                                 uid: uuidv4(),
//                                 name: res.data.fileName,
//                                 status: "done",
//                                 url: `${import.meta.env.VITE_BACKEND_URL}/storage/${folder}/${res.data.fileName}`,
//                             },
//                         ];

//                     const newList = multiple
//                         ? [...fileList, ...uploadedFiles].slice(0, maxCount)
//                         : uploadedFiles;

//                     setFileList(newList);
//                     onChangeFiles?.(newList);
//                     onSuccess?.("ok");
//                 } else {
//                     throw new Error(res.message || "Upload failed");
//                 }
//             } catch (err: any) {
//                 message.error(err.message || "Lỗi khi upload file");
//                 onError?.(err);
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [folder, fileList, multiple, maxCount, onChangeFiles]
//     );

//     const uploadProps: UploadProps = {
//         listType: "picture-card",
//         multiple,
//         fileList,
//         maxCount,
//         customRequest,
//         onPreview: handlePreview,
//         onRemove: (file) => {
//             const newList = fileList.filter((f) => f.uid !== file.uid);
//             setFileList(newList);
//             onChangeFiles?.(newList);
//         },
//     };

//     return (
//         <>
//             <Upload {...uploadProps}>
//                 {fileList.length >= maxCount ? null : (
//                     <div>
//                         {loading ? <LoadingOutlined /> : <PlusOutlined />}
//                         <div style={{ marginTop: 8 }}>Upload</div>
//                     </div>
//                 )}
//             </Upload>

//             <Modal
//                 open={previewOpen}
//                 title={previewTitle}
//                 footer={null}
//                 onCancel={() => setPreviewOpen(false)}
//             >
//                 <img alt="preview" style={{ width: "100%" }} src={previewImage} />
//             </Modal>
//         </>
//     );
// };

// export default UploadImage;
// <UploadImage
//   folder="device"
//   multiple
//   maxCount={3}
//   defaultFiles={[dataInit?.image1, dataInit?.image2, dataInit?.image3].filter(Boolean)}
//   onChangeFiles={(files) => setFileList(files)}
// />
