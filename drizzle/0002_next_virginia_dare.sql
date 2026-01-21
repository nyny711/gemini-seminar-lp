ALTER TABLE `seminar_registrations` MODIFY COLUMN `phone` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `seminar_registrations` ADD `position` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `seminar_registrations` ADD `challenge` text;--> statement-breakpoint
ALTER TABLE `seminar_registrations` ADD `selectedSeminars` text NOT NULL;--> statement-breakpoint
ALTER TABLE `seminar_registrations` DROP COLUMN `message`;