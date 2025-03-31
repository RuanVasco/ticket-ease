import { Modal } from "bootstrap";

export const closeModal = (modalId: string): void => {
	const modalElement = document.getElementById(modalId);
	if (!modalElement) return;

	const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);

	modalInstance.hide();
};
