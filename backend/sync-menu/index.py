import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''Синхронизация меню с Frontpad - получение и обновление блюд в базе данных'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    conn = None
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute('''
                SELECT id, name, description, price, category, image_url, rating, available
                FROM dishes
                WHERE available = true
                ORDER BY category, name
            ''')
            dishes = cur.fetchall()
            
            dishes_by_category = {}
            for dish in dishes:
                cat = dish['category']
                if cat not in dishes_by_category:
                    dishes_by_category[cat] = []
                dishes_by_category[cat].append({
                    'id': dish['id'],
                    'name': dish['name'],
                    'description': dish['description'],
                    'price': dish['price'],
                    'category': dish['category'],
                    'image_url': dish['image_url'],
                    'rating': float(dish['rating']) if dish['rating'] else 0.0,
                    'available': dish['available']
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'dishes': dishes_by_category,
                    'total': len(dishes)
                })
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            dishes_data = body.get('dishes', [])
            
            updated_count = 0
            for dish in dishes_data:
                cur.execute('''
                    INSERT INTO dishes (frontpad_id, name, description, price, category, image_url, rating, available)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (frontpad_id) 
                    DO UPDATE SET 
                        name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        price = EXCLUDED.price,
                        category = EXCLUDED.category,
                        image_url = EXCLUDED.image_url,
                        available = EXCLUDED.available,
                        updated_at = CURRENT_TIMESTAMP
                ''', (
                    dish.get('frontpad_id'),
                    dish['name'],
                    dish.get('description', ''),
                    dish['price'],
                    dish['category'],
                    dish.get('image_url'),
                    dish.get('rating', 0.0),
                    dish.get('available', True)
                ))
                updated_count += 1
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'updated': updated_count,
                    'message': f'Синхронизировано {updated_count} блюд'
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
