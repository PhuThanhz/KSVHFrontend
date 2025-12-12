import React from "react";
import {
  ControlOutlined,
  ToolOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

export const operationMenu = {
  label: "Quản lý kiểm soát vận hành",
  key: "operation-root",
  icon: <ControlOutlined />,
  children: [
    // =========================================================
    // 1️⃣ KIỂM SOÁT VẬN HÀNH (TEAM INC)
    // =========================================================
    {
      label: "Kiểm soát vận hành",
      key: "operation-business-root",
      icon: <ToolOutlined />,
      children: [
        // ===== HẠ TẦNG & THIẾT BỊ =====
        {
          label: "Hạ tầng & Thiết bị",
          key: "infrastructure-root",
          icon: <ToolOutlined />,
          children: [
            {
              label: (
                <NavLink
                  to="/admin/operation/infrastructure/full-equipment"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Đánh giá tổng thể thiết bị
                </NavLink>
              ),
              key: "full-equipment",
            },
            {
              label: (
                <NavLink
                  to="/admin/operation/infrastructure/active-equipment"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Đánh giá thiết bị gặp sự cố
                </NavLink>
              ),
              key: "active-equipment",
            },
            {
              label: (
                <NavLink
                  to="/admin/operation/infrastructure/status-check"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Kiểm tra tình trạng trang thiết bị
                </NavLink>
              ),
              key: "status-check",
            },
            {
              label: (
                <NavLink
                  to="/admin/operation/infrastructure/overview"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Hạ tầng thiết bị tổng thể
                </NavLink>
              ),
              key: "infrastructure-overview",
            },
          ],
        },

        // ===== VẬN HÀNH – KINH DOANH =====
        {
          label: "Vận hành – Kinh doanh",
          key: "business-root",
          icon: <CheckSquareOutlined />,
          children: [
            {
              label: (
                <NavLink
                  to="/admin/operation/business/oc-checklist"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Kiểm soát vận hành – OC Checklist
                </NavLink>
              ),
              key: "oc-checklist",
            },

            {
              label: "Chương trình khuyến mãi",
              key: "promotion-root",
              children: [
                {
                  label: (
                    <NavLink
                      to="/admin/operation/business/promotion/main"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Form chính
                    </NavLink>
                  ),
                  key: "promotion-main",
                },
                {
                  label: (
                    <NavLink
                      to="/admin/operation/business/promotion/extra"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Form bổ sung
                    </NavLink>
                  ),
                  key: "promotion-extra",
                },
              ],
            },
          ],
        },
      ],
    },

    // =========================================================
    // 2️⃣ HỆ THỐNG QSC – CHỈ GOM 1 MỤC DUY NHẤT
    // =========================================================
    {
      label: "Hệ thống QSC",
      key: "qsc-root",
      icon: <AppstoreOutlined />,
      children: [
        {
          label: (
            <NavLink
              to="/admin/operation/qsc/task-manager"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Quản lý nhiệm vụ kiểm tra
            </NavLink>
          ),
          key: "qsc-task-manager",
        },
        {
          label: (
            <NavLink
              to="/admin/operation/qsc/standard"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Bảng tổng hợp điểm (Standard)
            </NavLink>
          ),
          key: "qsc-standard",
        },
        {
          label: (
            <NavLink
              to="/admin/operation/qsc/action-plan"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Kế hoạch khắc phục (Action Plan)
            </NavLink>
          ),
          key: "qsc-action-plan",
        },
        {
          label: (
            <NavLink
              to="/admin/operation/qsc/form-builder"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Thiết lập & Tạo biểu mẫu
            </NavLink>
          ),
          key: "qsc-form-builder",
        },
      ],
    },

    // =========================================================
    // 3️⃣ MODULE KHÁC
    // =========================================================
    {
      label: (
        <NavLink
          to="/admin/operation/extra"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Khác / Đối soát FAST / Tác vụ bổ sung
        </NavLink>
      ),
      key: "extra",
      icon: <FileSearchOutlined />,
    },
  ],
};
