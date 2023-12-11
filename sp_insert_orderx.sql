USE myorders;

DROP PROCEDURE IF EXISTS sp_insert_orderx;

DELIMITER //
CREATE PROCEDURE sp_insert_orderx(IN products_names VARCHAR(600),userx_id INT, pricex INT)
BEGIN
    INSERT INTO orders(user_id,price) VALUES(userx_id, pricex);
    SELECT LAST_INSERT_ID() INTO @order_id;
    
    INSERT INTO order_details(order_id,starter_id, main_id,dessert_id)
    SELECT order_id, b.starter_id, null, null
    FROM orders
    JOIN starters b ON
    FIND_IN_SET(b.starter_name, products_names)
    WHERE order_id = @order_id;
    
	INSERT INTO order_details(order_id,starter_id, main_id,dessert_id)
    SELECT order_id, null, c.main_id, null
    FROM orders
    JOIN mains c ON
    FIND_IN_SET(c.main_name, products_names)
    WHERE order_id = @order_id;
    
	INSERT INTO order_details(order_id,starter_id, main_id,dessert_id)
    SELECT order_id, null, null, d.dessert_id
    FROM orders
    JOIN desserts d ON
    FIND_IN_SET(d.dessert_name, products_names)
    WHERE order_id = @order_id;
END //
DELIMITER ;

create view vw_order_details as
select orders.order_id, orders.user_id, orders.price, starter_id, main_id, dessert_id
from orders
join order_details
on orders.order_id = order_details.order_id;