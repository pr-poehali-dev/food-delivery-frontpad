import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Управление заказами - создание, получение и обновление статусов заказов'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    conn = None
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_phone = params.get('phone')
            
            if user_phone:
                cur.execute('''
                    SELECT o.id, o.frontpad_order_id, o.user_name, o.status, 
                           o.total, o.items_count, o.delivery_address,
                           o.created_at
                    FROM orders o
                    WHERE o.user_phone = %s
                    ORDER BY o.created_at DESC
                ''', (user_phone,))
            else:
                cur.execute('''
                    SELECT id, frontpad_order_id, user_name, status, 
                           total, items_count, created_at
                    FROM orders
                    ORDER BY created_at DESC
                    LIMIT 50
                ''')
            
            orders = cur.fetchall()
            
            formatted_orders = []
            for order in orders:
                formatted_orders.append({
                    'id': order['id'],
                    'frontpad_order_id': order.get('frontpad_order_id'),
                    'user_name': order.get('user_name'),
                    'status': order['status'],
                    'total': order['total'],
                    'items': order['items_count'],
                    'date': order['created_at'].strftime('%d.%m.%Y') if order['created_at'] else '',
                    'delivery_address': order.get('delivery_address')
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'orders': formatted_orders})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO orders (user_name, user_phone, status, total, items_count, delivery_address)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body.get('user_name'),
                body.get('user_phone'),
                'pending',
                body['total'],
                body['items_count'],
                body.get('delivery_address')
            ))
            
            order_id = cur.fetchone()['id']
            
            for item in body.get('items', []):
                cur.execute('''
                    INSERT INTO order_items (order_id, dish_id, quantity, price)
                    VALUES (%s, %s, %s, %s)
                ''', (order_id, item['dish_id'], item['quantity'], item['price']))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'order_id': order_id,
                    'message': 'Заказ создан успешно'
                })
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            order_id = body.get('order_id')
            new_status = body.get('status')
            frontpad_id = body.get('frontpad_order_id')
            
            if frontpad_id:
                cur.execute('''
                    UPDATE orders 
                    SET status = %s, frontpad_order_id = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                ''', (new_status, frontpad_id, order_id))
            else:
                cur.execute('''
                    UPDATE orders 
                    SET status = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                ''', (new_status, order_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Статус заказа обновлен'
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if conn:
            conn.close()
