ALTER TABLE notification DROP CONSTRAINT fknk4ftb5am9ubmkv1661h15ds9;

ALTER TABLE notification
ADD CONSTRAINT fk_notification_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;
