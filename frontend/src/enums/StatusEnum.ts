export enum StatusEnum {
	PENDING_APPROVAL = "PENDING_APPROVAL",
	NEW = "NEW",
	IN_PROGRESS = "IN_PROGRESS",
	PENDING = "PENDING",
	RESOLVED = "RESOLVED",
	CLOSED = "CLOSED",
	CANCELED = "CANCELED",
}

export const StatusLabels: Record<StatusEnum, string> = {
	[StatusEnum.PENDING_APPROVAL]: "Aguardando Aprovação",
	[StatusEnum.NEW]: "Novo",
	[StatusEnum.IN_PROGRESS]: "Em Andamento",
	[StatusEnum.PENDING]: "Pendente",
	[StatusEnum.RESOLVED]: "Resolvido",
	[StatusEnum.CLOSED]: "Fechado",
	[StatusEnum.CANCELED]: "Cancelado",
};
