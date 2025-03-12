import React, { useState } from "react";
import { useMessages } from "./MessagesContext";

const Notifications = () => {
	const { notifications, clearNotifications } = useMessages();
	const [isOpen, setIsOpen] = useState(false);

	const totalUnread = Object.values(notifications).reduce(
		(acc, messages) => acc + messages.length,
		0
	);

    const handleOpenNotifications = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            Object.keys(notifications).forEach(ticketId => clearNotifications(Number(ticketId)));
        }
    };

	return (
		<div className="notifications">
			<button onClick={ handleOpenNotifications } className="notification-icon">
				🔔 {totalUnread > 0 && <span className="badge">{totalUnread}</span>}
			</button>

			{isOpen && (
				<div className="notification-dropdown">
					{Object.entries(notifications).map(([ticketId, messages]) => (
						<div key={ticketId} className="notification-item">
							<strong>Ticket #{ticketId}</strong>
							{messages.map((msg, index) => (
								<div key={index} className="message">
									{msg.text} - <em>{new Date(msg.sentAt).toLocaleTimeString()}</em>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Notifications;