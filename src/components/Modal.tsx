import { ExclamationCircleFilled } from "@ant-design/icons";
import { App } from "antd";
import { useTranslate } from "@refinedev/core";

export const useDeleteConfirm = () => {
  const t = useTranslate();
  const { modal } = App.useApp();

  const showDeleteConfirm = (onDelete: () => void) => {
    modal.confirm({
      title: t('modal.delete.confirm', {}, 'Delete item?'),
      icon: <ExclamationCircleFilled />,
      content: t('modal.delete.confirm.message', {}, 'Are you sure you want to delete this item?'),
      okText: t('modal.delete.confirm.yes', {}, 'Yes'),
      okType: "danger",
      cancelText: t('modal.delete.confirm.no', {}, 'No'),
      onOk: onDelete,
    });
  };
  return { showDeleteConfirm };
};

export const useUnsavedConfirm = () => {
  const t = useTranslate();
  const { modal } = App.useApp();

  const showUnsavedConfirm = (onConfirm: () => void, onCancel?: () => void) => {
    modal.confirm({
      title: t('modal.unsaved.confirm', {}, "Unsaved changes"),
      icon: <ExclamationCircleFilled />,
      content: t('modal.unsaved.message', {}, "You have unsaved changes. Do you want to discard them?"),
      okText: t('modal.unsaved.discard', {}, "Discard"),
      okType: "danger",
      cancelText: t('modal.unsaved.cancel', {}, "Cancel"),
      onOk: onConfirm,
      onCancel: onCancel,
    });
  };
  return { showUnsavedConfirm };
};