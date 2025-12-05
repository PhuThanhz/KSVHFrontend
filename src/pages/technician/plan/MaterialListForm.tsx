import {
    ProFormList,
    ProFormText,
    ProFormSelect,
} from "@ant-design/pro-components";
import { Avatar, Tag, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { IInventoryItem } from "@/types/backend";
import { isMobile } from "react-device-detect";

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

    const handleMaterialInput = (input: string | number | null, index: number) => {
        if (!input) return;
        const selected = inventoryOptions.find(
            (i) => i.itemCode === input || i.id === input
        );

        if (selected) {
            form.setFields([
                { name: ["materials", index, "inventoryItemId"], value: selected.id },
                { name: ["materials", index, "partCode"], value: selected.itemCode },
                { name: ["materials", index, "partName"], value: selected.itemName },
                { name: ["materials", index, "quantity"], value: 1 },
                { name: ["materials", index, "tag"], value: "Có sẵn" },
                { name: ["materials", index, "isNewProposal"], value: false },
            ]);
        } else {
            form.setFields([
                { name: ["materials", index, "inventoryItemId"], value: null },
                { name: ["materials", index, "partCode"], value: String(input) },
                { name: ["materials", index, "partName"], value: "" },
                { name: ["materials", index, "quantity"], value: 1 },
                { name: ["materials", index, "tag"], value: "Mua bổ sung" },
                { name: ["materials", index, "isNewProposal"], value: true },
            ]);
        }
    };

    return (
        <div style={{ overflowX: "auto" }}>
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
                        <table
                            className="w-full text-sm border border-gray-200 rounded-lg mb-3"
                            style={{ minWidth: 800 }}
                        >
                            {/* Chỉ hiển thị header cho phần tử đầu tiên */}
                            {index === 0 && (
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="text-left p-2 w-[25%]">Mã vật tư</th>
                                        <th className="text-left p-2 w-[30%]">Tên vật tư</th>
                                        <th className="text-left p-2 w-[15%]">Số lượng cần</th>
                                        <th className="text-left p-2 w-[15%]">Tình trạng</th>
                                        <th className="text-center p-2 w-[10%]">Thao tác</th>
                                    </tr>
                                </thead>
                            )}

                            <tbody>
                                <tr className="align-top border-t">
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
                                                onChange: (value) =>
                                                    handleMaterialInput(value as string | number | null, index),
                                                onSearch: (value) => {
                                                    const exists = inventoryOptions.find(
                                                        (i) =>
                                                            i.itemCode.toLowerCase() ===
                                                            value.toLowerCase()
                                                    );
                                                    if (!exists && value) {
                                                        form.setFields([
                                                            {
                                                                name: ["materials", index, "partCode"],
                                                                value,
                                                            },
                                                            {
                                                                name: ["materials", index, "tag"],
                                                                value: "Mua bổ sung",
                                                            },
                                                            {
                                                                name: ["materials", index, "inventoryItemId"],
                                                                value: null,
                                                            },
                                                            {
                                                                name: ["materials", index, "isNewProposal"],
                                                                value: true,
                                                            },
                                                        ]);
                                                    }
                                                },
                                            }}
                                        />
                                    </td>

                                    <td className="p-2">
                                        <ProFormText
                                            name="partName"
                                            placeholder="Nhập tên vật tư"
                                            rules={[{ required: true, message: "Vui lòng nhập tên vật tư" }]}
                                        />
                                    </td>

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

                                    <td className="p-2 text-center align-middle">
                                        <Tag
                                            color={getTagColor(tagValue)}
                                            style={{
                                                fontSize: 13,
                                                padding: "3px 10px",
                                                minWidth: 80,
                                                display: "inline-block",
                                                textAlign: "center",
                                            }}
                                        >
                                            {tagValue || "—"}
                                        </Tag>
                                    </td>

                                    <td className="text-center align-middle p-2">
                                        <Tooltip title="Xóa vật tư">
                                            <Popconfirm
                                                title="Xóa vật tư"
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                onConfirm={() => action.remove(field.name)}
                                            >
                                                <DeleteOutlined
                                                    style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
                                                />
                                            </Popconfirm>
                                        </Tooltip>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                }}
            </ProFormList>
        </div>
    );
};

export default MaterialListForm;
