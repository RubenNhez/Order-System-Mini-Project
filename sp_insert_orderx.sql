USE myorders;

DROP PROCEDURE IF EXISTS sp_insert_orderx;

DELIMITER //
CREATE PROCEDURE sp_insert_orderx(IN starter_ids VARCHAR(600),IN main_ids VARCHAR(600),IN dessert_ids VARCHAR(600), userx_id INT)
BEGIN

    
	SET @s = CONCAT('SELECT sum(starter_price) FROM starters WHERE starter_id IN (', starter_ids, ') into @sumprice');
    PREPARE stmt FROM @s;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT @sumprice;
    
	SET @s = CONCAT('SELECT sum(main_price) FROM mains WHERE main_id IN (', main_ids, ') into @sumpriceone');
    PREPARE stmt FROM @s;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT @sumpriceone;
    
	SET @s = CONCAT('SELECT sum(dessert_price) FROM desserts WHERE dessert_id IN (', dessert_ids, ') into @sumpricetwo');
    PREPARE stmt FROM @s;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT @sumpricetwo;
    
    
    INSERT INTO orders(user_id,price) VALUES(userx_id, @sumprice+@sumpriceone+@sumpricetwo);
    SELECT LAST_INSERT_ID() INTO @order_id;

    
    INSERT INTO order_details(order_id,starter_id, main_id,dessert_id)
    SELECT order_id, b.starter_id, null, null
    FROM orders
    JOIN starters b ON
    FIND_IN_SET(b.starter_id, starter_ids)
    WHERE order_id = @order_id;
    
	INSERT INTO order_details(order_id,starter_id, main_id,dessert_id)
    SELECT order_id, null, c.main_id, null
    FROM orders
    JOIN mains c ON
    FIND_IN_SET(c.main_id, main_ids)
    WHERE order_id = @order_id;
    
	INSERT INTO order_details(order_id,starter_id, main_id,dessert_id)
    SELECT order_id, null, null, d.dessert_id
    FROM orders
    JOIN desserts d ON
    FIND_IN_SET(d.dessert_id, dessert_ids)
    WHERE order_id = @order_id;
    
END //
DELIMITER ;

create view vw_order_details as
select orders.order_id, orders.user_id, orders.price, starter_id, main_id, dessert_id
from orders
join order_details
on orders.order_id = order_details.order_id;