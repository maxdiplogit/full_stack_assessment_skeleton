USE home_db;


SET PERSIST local_infile = 1;


DROP TABLE IF EXISTS `user_home_rel`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `home`;


CREATE TABLE user (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE home (
    `home_id` INT AUTO_INCREMENT PRIMARY KEY,
    `street_address` VARCHAR(255) DEFAULT NULL,
    `state` VARCHAR(50) DEFAULT NULL,
    `zip` VARCHAR(10) DEFAULT NULL,
    `sqft` FLOAT DEFAULT NULL,
    `beds` INT DEFAULT NULL,
    `baths` INT DEFAULT NULL,
    `list_price` FLOAT DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE user_home_rel (
    `user_id` INT,
    `home_id` INT,
    PRIMARY KEY (user_id, home_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (home_id) REFERENCES home(home_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


INSERT INTO user (username, email)
SELECT DISTINCT username, email
FROM user_home;


INSERT INTO home (street_address, state, zip, sqft, beds, baths, list_price)
SELECT DISTINCT street_address, state, zip, sqft, beds, baths, list_price
FROM user_home;


INSERT INTO user_home_rel (user_id, home_id)
SELECT u.user_id, h.home_id
FROM user_home uh
JOIN user u ON uh.username = u.username AND uh.email = u.email
JOIN home h ON uh.street_address = h.street_address AND uh.state = h.state AND uh.zip = h.zip AND uh.sqft = h.sqft AND uh.beds = h.beds AND uh.baths = h.baths AND uh.list_price = h.list_price;