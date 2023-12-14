CREATE DATABASE myorders;

use myorders;

CREATE TABLE users(user_id INT AUTO_INCREMENT NOT NULL,firstname VARCHAR(50),lastname VARCHAR(50),email VARCHAR(50),username VARCHAR(50), hashedpassword VARCHAR(100),PRIMARY KEY(user_id));

CREATE TABLE starters(starter_id INT AUTO_INCREMENT NOT NULL,starter_name VARCHAR(50), starter_price DECIMAL(5,2) unsigned,PRIMARY KEY(starter_id));

INSERT INTO starters (starter_name, starter_price) VALUES
('Baked goats cheese with pear and rocket salad', 7.99),
('Crispy mozzarella sticks with a rich tomato sauce', 5.99),
('Mushrooms stuffed with cashew nut and peas', 6.99),
('Tomato saffron and ricotta tart', 6.50),
('Creamy mushroom soup with crusty rolls', 5.99),
('Spicy roast butternut soup with crusty rolls', 8.99),
('Spinach and feta cheese tart', 6.75),
('Leek & blue cheese tartlet with roasted tomatoes', 8.00),
('Leek and potato soup with crusty rolls', 7.00),
('Sichuan Chinese chicken wings', 8.50),
('Spinach, feta filo parcels and creamy tzatziki dip', 7.75),
('Crispy Coconut Prawns in Tangy Mango Sauce', 9.25),
('Fennel and courgette soup with crusty rolls', 6.20),
('Mushroom filo Parcels with Pumpkin Sauce', 6.65);,
('No Starter', 0.00);

CREATE TABLE mains(main_id INT AUTO_INCREMENT NOT NULL,main_name VARCHAR(50), main_price DECIMAL(5,2) unsigned,PRIMARY KEY(main_id));

INSERT INTO mains (main_name, main_price) VALUES
('Chicken goujons wraps with parmesan mayo', 10.99),
('Italian chicken with mushroom & spinach risotto', 11.00),
('Chicken and spinach curry with poppadoms', 12.99),
('Beef and red wine lasagne with a green salad', 11.50),
('Lamb shank and lentil stew', 13.50),
('Chicken&tomato tagine with lemon& couscous', 14.99),
('Harissa sticky chicken with pistachio', 14.30),
('Southern fried chicken with a side of slaw', 11.25),
('Pork chops in a creamy cider sauce with rice', 13.00),
('Char Siu duck legs with a modern Asian slaw', 12.70),
('Hearty lamb and aubergine moussaka with salad', 13.80),
('Jerk Chicken with Sweet Potato & Bean Stew', 15.00),
('Chicken tartiflette and salad', 10.99),
('Bacon Wrapped Pork Fillet with Dauphinoise', 11.80),
('No Main', 0.00);


CREATE TABLE desserts(dessert_id INT AUTO_INCREMENT NOT NULL,dessert_name VARCHAR(50), dessert_price DECIMAL(5,2) unsigned,PRIMARY KEY(dessert_id));

INSERT INTO desserts (dessert_name, dessert_price) VALUES
('Strawberry mille-feuille', 5.99),
('Strawberry mascarpone Tart with chocolate pastry', 4.99),
('Indian pineapple upside down cake', 4.99),
('Italian apple cake', 5.40),
('French tart citron', 4.99),
('Chocolate pistachio cake with orange & honey', 7.50),
('Chocolate orange tart with spiced oranges', 5.20),
('Blueberry & white chocolate cheesecake', 5.25),
('Baked butterscotch cheesecake', 6.00),
('Chinese pineapple fritters and spiced toffee sauce', 9.00),
('Karidopita Greek walnut cake flavoured and oranges', 8.25),
('Caribbean Bakewell Tart', 5.75),
('Strawberry crepes', 4.99),
('Summer Fruit Crumble', 7.15),
('No Dessert', 0.00);


CREATE TABLE orders (
    order_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    price INT,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_details (
    order_id INT,
    starter_id INT,
    main_id INT,
    dessert_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (starter_id) REFERENCES starters(starter_id),
    FOREIGN KEY (main_id) REFERENCES mains(main_id),
    FOREIGN KEY (dessert_id) REFERENCES desserts(dessert_id)
);
