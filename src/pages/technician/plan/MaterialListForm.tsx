import {
    ProFormList,
    ProFormText,
    ProFormSelect,
} from "@ant-design/pro-components";
import { Avatar, Tag, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { IInventoryItem } from "@/types/backend";

interface MaterialListFormProps {
    form: any;
    selectOptions: { label: string; value: number | string; item: IInventoryItem }[];
    inventoryOptions: IInventoryItem[];
    backendURL: string;
}

const MaterialListForm = ({
    form,
    selectOptions,
    inventoryOptions,
    backendURL,
}: MaterialListFormProps) => {
    /** Hiển thị vật tư kho với hình ảnh và tồn kho */
    const renderOption = (item: IInventoryItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {item.image && (
                <Avatar
                    shape="square"
                    size={40}
                    src={`${backendURL}/storage/inventory/${item.image}`}
                />
            )}
            <div>
                <strong>{item.itemCode}</strong> - {item.itemName}
                <div style={{ fontSize: 12, color: "#888" }}>
                    Kho: {item.warehouse?.warehouseName ?? "N/A"} | Tồn: {item.quantity ?? 0}
                </div>
            </div>
        </div>
    );

    /** Chọn màu tag theo tình trạng */
    const getTagColor = (tag: string) => {
        switch (tag) {
            case "Có sẵn":
                return "green";
            case "Thiếu":
                return "red";
            case "Mua bổ sung":
                return "orange";
            default:
                return "default";
        }
    };

    /** Khi người dùng chọn mã vật tư hoặc nhập mới */
    const handleMaterialInput = (input: string | number | null, index: number) => {
        if (!input) return;
        const selected = inventoryOptions.find(
            (i) => i.itemCode === input || i.id === input
        );

        if (selected) {
            // Cập nhật đồng loạt, tránh nhiều render
            form.setFields([
                { name: ["materials", index, "inventoryItemId"], value: selected.id },
                { name: ["materials", index, "partCode"], value: selected.itemCode },
                { name: ["materials", index, "partName"], value: selected.itemName },
                { name: ["materials", index, "quantity"], value: 1 },
                { name: ["materials", index, "tag"], value: "Có sẵn" },
            ]);
        } else {
            form.setFields([
                { name: ["materials", index, "inventoryItemId"], value: null },
                { name: ["materials", index, "partCode"], value: String(input) },
                { name: ["materials", index, "tag"], value: "Mua bổ sung" },
            ]);
        }
    };

    return (
        <ProFormList
            name="materials"
            label="Danh sách vật tư"
            copyIconProps={false}
            deleteIconProps={false}
            creatorButtonProps={{
                icon: <PlusOutlined />,
                position: "bottom",
                creatorButtonText: "Thêm vật tư",
            }}
        >
            {(field, index, action) => {
                const tagValue = form.getFieldValue(["materials", index, "tag"]);

                return (
                    <div className="border border-gray-200 rounded-lg mb-3">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="text-left p-2 w-[28%]">Mã vật tư</th>
                                    <th className="text-left p-2 w-[30%]">Tên vật tư</th>
                                    <th className="text-left p-2 w-[15%]">Số lượng cần</th>
                                    <th className="text-left p-2 w-[15%]">Tình trạng</th>
                                    <th className="text-center p-2 w-[10%]">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="align-top">
                                    {/* Cột mã vật tư */}
                                    <td className="p-2">
                                        <ProFormSelect
                                            name="partCode"
                                            showSearch
                                            allowClear
                                            placeholder="Nhập hoặc chọn mã vật tư"
                                            options={selectOptions.map((opt) => ({
                                                label: `${opt.item.itemCode} - ${opt.item.itemName}`,
                                                value: opt.item.itemCode,
                                                item: opt.item,
                                            }))}
                                            fieldProps={{
                                                optionRender: (option) =>
                                                    renderOption(option.data.item as IInventoryItem),
                                                filterOption: (input, option) => {
                                                    const item = option?.item as IInventoryItem | undefined;
                                                    if (!item) return false;
                                                    const code = item.itemCode?.toLowerCase() || "";
                                                    const name = item.itemName?.toLowerCase() || "";
                                                    const keyword = input.toLowerCase();
                                                    return code.includes(keyword) || name.includes(keyword);
                                                },
                                                onChange: (value) => {
                                                    handleMaterialInput(value as string | number | null, index);
                                                },
                                            }}
                                        />
                                    </td>

                                    {/* Cột tên vật tư */}
                                    <td className="p-2">
                                        <ProFormText
                                            name="partName"
                                            placeholder="Nhập tên vật tư"
                                            rules={[{ required: true, message: "Vui lòng nhập tên vật tư" }]}
                                        />
                                    </td>

                                    {/* Cột số lượng */}
                                    <td className="p-2">
                                        <ProFormText
                                            name="quantity"
                                            placeholder="Nhập số lượng cần"
                                            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                                            fieldProps={{
                                                type: "number",
                                                min: 1,
                                                onBlur: (e) => {
                                                    const val = Number(e.target.value);
                                                    const selectedId = form.getFieldValue([
                                                        "materials",
                                                        index,
                                                        "inventoryItemId",
                                                    ]);
                                                    const item = inventoryOptions.find((i) => i.id === selectedId);
                                                    if (item) {
                                                        form.setFieldValue(
                                                            ["materials", index, "tag"],
                                                            val > item.quantity ? "Thiếu" : "Có sẵn"
                                                        );
                                                    } else {
                                                        form.setFieldValue(
                                                            ["materials", index, "tag"],
                                                            "Mua bổ sung"
                                                        );
                                                    }
                                                },
                                            }}
                                        />
                                    </td>

                                    {/* Cột tình trạng */}
                                    <td className="p-2 text-center align-middle">
                                        <Tag
                                            color={getTagColor(tagValue)}
                                            style={{
                                                fontSize: 13,
                                                padding: "3px 10px",
                                            }}
                                        >
                                            {tagValue || "—"}
                                        </Tag>
                                    </td>

                                    {/* Cột xóa */}
                                    <td className="text-center align-middle p-2">
                                        <Tooltip title="Xóa vật tư">
                                            <Popconfirm
                                                title="Xóa vật tư"
                                                description="Bạn có chắc chắn muốn xóa vật tư này?"
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                onConfirm={() => action.remove(field.name)}
                                            >
                                                <DeleteOutlined
                                                    style={{
                                                        fontSize: 18,
                                                        color: "#ff4d4f",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Popconfirm>
                                        </Tooltip>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            }}
        </ProFormList>
    );
};

export default MaterialListForm;
