import json
import os

def handler(event: dict, context) -> dict:
    '''Обработка уведомлений от Frontpad о статусах заказов и изменениях в меню'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Frontpad-Signature'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        notification_type = body.get('type')
        data = body.get('data', {})
        
        notifications = []
        
        if notification_type == 'order_status_changed':
            order_id = data.get('order_id')
            new_status = data.get('status')
            
            status_messages = {
                'pending': 'Заказ принят',
                'cooking': 'Заказ готовится',
                'ready': 'Заказ готов',
                'delivering': 'Курьер в пути',
                'delivered': 'Заказ доставлен',
                'cancelled': 'Заказ отменен'
            }
            
            notifications.append({
                'order_id': order_id,
                'status': new_status,
                'message': status_messages.get(new_status, 'Статус изменен'),
                'timestamp': data.get('timestamp')
            })
        
        elif notification_type == 'menu_updated':
            dish_count = data.get('updated_count', 0)
            notifications.append({
                'type': 'menu_update',
                'message': f'Меню обновлено: {dish_count} блюд',
                'timestamp': data.get('timestamp')
            })
        
        elif notification_type == 'dish_availability_changed':
            dish_name = data.get('dish_name')
            available = data.get('available')
            
            notifications.append({
                'type': 'availability',
                'dish': dish_name,
                'available': available,
                'message': f"{'Доступно' if available else 'Недоступно'}: {dish_name}",
                'timestamp': data.get('timestamp')
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'notifications': notifications,
                'processed': len(notifications)
            })
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
