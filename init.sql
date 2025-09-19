-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(1000) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Insert some sample notifications
INSERT INTO notifications (user_id, message, is_read, created_at) VALUES
(1, 'Welcome to the notification system!', false, NOW() - INTERVAL '1 hour'),
(1, 'Your profile has been updated successfully.', true, NOW() - INTERVAL '2 hours'),
(1, 'New task has been assigned to you.', false, NOW() - INTERVAL '30 minutes'),
(2, 'Your report is ready for review.', false, NOW() - INTERVAL '45 minutes'),
(1, 'System maintenance scheduled for tonight.', false, NOW() - INTERVAL '15 minutes');
