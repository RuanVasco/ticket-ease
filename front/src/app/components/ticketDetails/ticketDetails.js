import React, { useState, useEffect, useRef } from "react";
import { BsSendCheck, BsSend } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa6";
import Header from "../../components/header/header";
import axiosInstance from "../axiosConfig";
import { useWebSocket } from "../webSocketContext";
import getUserData from "../getUserData";
import DateFormatter from "../DateFormatter";
import { checkPermission } from "../checkPermission";
import styles from "./ticket_style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TicketDetails = ({ id }) => {
	const userData = getUserData();
	const [data, setData] = useState(null);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState({
		text: "",
		closeTicket: false,
	});
	const [loading, setLoading] = useState(true);
	const [isManager, setIsManager] = useState(false);

	const chatEndRef = useRef(null);
	const intervalRef = useRef(null);

	const stompClient = useWebSocket();

	function getFirstName(fullName) {
		return fullName.split(" ")[0];
	}

	const getMessages = async () => {
		const response = await axiosInstance.get(
			`${API_BASE_URL}/messages/ticket/${id}`
		);

		if (response.status === 200 || response.status === 201) {
			setMessages(response.data);

			const lastMessage =
				response.data.length > 0
					? response.data[response.data.length - 1]
					: null;
			if (lastMessage && lastMessage.ticket.status === "Fechado") {
				clearInterval(intervalRef.current);
				setData((prevData) => ({
					...prevData,
					status: "Fechado",
				}));
			}
		} else {
			console.error("Erro ao buscar mensagens:", response.status);
		}
	};

	useEffect(() => {
		const checkUserPermission = async () => {
			const isManager = await checkPermission("EDIT", "TICKET");
			setIsManager(isManager);
		};

		checkUserPermission();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get(
					`${API_BASE_URL}/tickets/${id}`
				);
				setData(response.data);
			} catch (error) {
				if (error.response && error.response.status === 403) {
					window.location.href = "../../";
				} else {
					console.error("Erro ao buscar dados:", error);
				}
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchData();
		}
	}, [id]);

	useEffect(() => {
		const fetchMessages = async () => {
			if (!id) {
				console.error("ticketId não está definido.");
				return;
			}

			try {
				getMessages();
			} catch (error) {
				console.error("Erro ao buscar mensagens:", error);
			}
		};

		fetchMessages();
		return () => clearInterval(intervalRef.current);
	}, [id, data?.status]);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleInputChange = (event) => {
		const { name, value, type, checked } = event.target;
		setMessage((prevMessage) => ({
			...prevMessage,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e, close = false) => {
		e.preventDefault();

		if (message.text.trim() === "") {
			return;
		}

		if (stompClient && stompClient.connected) {
			try {
				stompClient.publish({
					destination: `/app/ticket/${id}`,
					body: JSON.stringify({
						text: message.text,
						closeTicket: close,
					}),
				});

				try {
					getMessages();
					setMessage({ ...message, text: "" });
				} catch (error) {
					console.error("Erro ao buscar mensagens:", error);
				}

				if (close) {
					location.reload();
				}
			} catch (error) {
				console.error("Erro ao enviar mensagem via WebSocket:", error);
			}
		} else {
			console.error("WebSocket não conectado.");
		}

		// try {
		// 	const res = await axiosInstance.post(`${API_BASE_URL}/messages/ticket/${message.ticket_id}`, {
		// 		text: message.text,
		// 		closeTicket: close,
		// 	});

		// 	if (res.status === 200 || res.status === 201) {
		// 		if (res.data.ticket.status === "Fechado") {
		// 			location.reload();
		// 		}

		// 		setMessages((prevMessages) => [...prevMessages, res.data]);
		// 		setMessage({ ...message, text: "" });
		// 	} else {
		// 		console.error("Erro ao enviar mensagem:", res.status);
		// 	}
		// } catch (error) {
		// 	console.error("Erro ao enviar mensagem:", error);
		// }
	};

	if (loading) {
		return <></>;
	}

	return (
		<main>
			<Header
				pageName={`Chamado ${data?.id || ""} - ${data?.name || ""}`}
			/>
			<div className="container">
				<div className="row mt-3">
					<div className="col-9">
						<div className="d-flex flex-column">
							<div className="box_description p-2 rounded mb-2 d-flex">
								<div className="fw-semibold">
									{data?.description || ""}
								</div>
								{data?.filePaths &&
									data.filePaths.length > 0 && (
										<button
											type="button"
											className="btn-clean ms-auto"
											data-bs-toggle="modal"
											data-bs-target="#attachmentsModal"
										>
											Anexos <FaPaperclip />
										</button>
									)}
							</div>
							<div className="chat_content rounded px-2 pb-3">
								{messages.length > 0 ? (
									messages.map((msg) =>
										msg.user.id === userData.id ? (
											<div
												key={msg.id}
												className="mt-3 message-box-sent"
											>
												<div className="message-bubble">
													<div className="box_message_details mb-2">
														{getFirstName(
															msg.user.name
														)}
														<span> - </span>
														{new DateFormatter(
															msg.sent_at
														).toDateTime()}
													</div>
													{msg.text}
												</div>
											</div>
										) : (
											<div
												key={msg.id}
												className="mt-3 message-box-received"
											>
												<div className="message-bubble">
													<div className="box_message_details mb-2">
														{getFirstName(
															msg.user.name
														)}
														<span> - </span>
														{new DateFormatter(
															msg.sent_at
														).toDateTime()}
													</div>
													{msg.text}
												</div>
											</div>
										)
									)
								) : isManager ? (
									<p>
										Envie uma mensagem para iniciar o
										chamado.
									</p>
								) : null}
								<div ref={chatEndRef} />
							</div>
							{data?.status !== "Fechado" && (
								<form
									className="mt-3 input-group"
									onSubmit={handleSubmit}
								>
									<input
										type="text"
										className="input-text form-control"
										name="text"
										value={message.text}
										onChange={handleInputChange}
										placeholder="Digite sua mensagem..."
									/>
									<button
										type="submit"
										className="btn_send_message"
									>
										Enviar
										<BsSend className="ms-2" />
									</button>
									{isManager && (
										<div className="dropup">
											<button
												type="button"
												className="btn_send_message_dropdown_togle dropdown-toggle dropdown-toggle-split"
												data-bs-toggle="dropdown"
												aria-expanded="false"
											></button>
											<ul className="dropdown-menu dropdown_options_message dropdown-menu-end ">
												<li>
													<button
														className="dropdown-item"
														onClick={(e) =>
															handleSubmit(
																e,
																true
															)
														}
													>
														Enviar e finalizar
														chamado
														<BsSendCheck className="ms-2" />
													</button>
												</li>
											</ul>
										</div>
									)}
								</form>
							)}
						</div>
					</div>
					<div className="col col_ticket_info">
						<span>Por </span>
						<br />
						<div className="box_user_identity rounded p-2 mt-2">
							<span>{data?.user?.name || ""}</span> <br />
							<span className="fw-lighter">
								{data?.user?.cargo?.name || ""}
							</span>{" "}
							<br />
						</div>
						<label htmlFor="user" className="col-form-label">
							Setor
						</label>
						<input
							id="user"
							className="input-text"
							type="text"
							value={data?.user?.department?.name || ""}
							readOnly
						/>
						<label htmlFor="department" className="col-form-label">
							Categoria
						</label>
						<input
							id="department"
							className="input-text"
							type="text"
							value={data?.ticketCategory?.path || ""}
							readOnly
						/>
						<label htmlFor="created_at" className="col-form-label">
							Data de Abertura
						</label>
						<input
							id="created_at"
							className="input-text"
							type="text"
							value={
								new DateFormatter(
									data?.createdAt
								).toDateTime() || ""
							}
							readOnly
						/>
						<label htmlFor="observation" className="col-form-label">
							Observação
						</label>
						<textarea
							id="observation"
							className="input-text"
							value={data?.observation || ""}
							readOnly
						/>
						<label htmlFor="urgency" className="col-form-label">
							Urgência
						</label>
						<input
							id="urgency"
							className="input-text"
							type="text"
							value={data?.urgency || ""}
							readOnly
						/>
						<label htmlFor="status" className="col-form-label">
							Status
						</label>
						<input
							id="status"
							className="input-text"
							type="text"
							value={data?.status || ""}
							readOnly
						/>
					</div>
				</div>
			</div>
		</main>
	);
};

export default TicketDetails;
