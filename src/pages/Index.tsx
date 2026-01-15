import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Index = () => {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: number, quantity: number}>>([]);
  const [activeTab, setActiveTab] = useState('home');

  const categories = [
    { id: 1, name: 'Пицца', icon: '🍕', color: 'bg-orange-100 text-orange-600' },
    { id: 2, name: 'Бургеры', icon: '🍔', color: 'bg-red-100 text-red-600' },
    { id: 3, name: 'Суши', icon: '🍱', color: 'bg-pink-100 text-pink-600' },
    { id: 4, name: 'Десерты', icon: '🍰', color: 'bg-purple-100 text-purple-600' },
    { id: 5, name: 'Напитки', icon: '🥤', color: 'bg-blue-100 text-blue-600' },
  ];

  const popularDishes = [
    { id: 1, name: 'Маргарита', price: 590, rating: 4.8, image: '🍕', category: 'Пицца', description: 'Классическая итальянская пицца' },
    { id: 2, name: 'Чизбургер Делюкс', price: 450, rating: 4.9, image: '🍔', category: 'Бургеры', description: 'Сочный бургер с двойным сыром' },
    { id: 3, name: 'Филадельфия', price: 680, rating: 4.7, image: '🍱', category: 'Суши', description: 'Роллы с лососем и сливочным сыром' },
    { id: 4, name: 'Чизкейк Нью-Йорк', price: 320, rating: 4.9, image: '🍰', category: 'Десерты', description: 'Классический американский чизкейк' },
  ];

  const orders = [
    { id: 1, status: 'delivered', date: '12.01.2026', total: 1240, items: 3 },
    { id: 2, status: 'cooking', date: '15.01.2026', total: 890, items: 2 },
  ];

  const reviews = [
    { id: 1, user: 'Анна М.', rating: 5, text: 'Отличная доставка! Все быстро и горячее', date: '14.01.2026' },
    { id: 2, user: 'Дмитрий К.', rating: 4, text: 'Вкусно, но немного задержали доставку', date: '13.01.2026' },
  ];

  const promos = [
    { id: 1, title: 'Скидка 30%', subtitle: 'На первый заказ', code: 'FIRST30', color: 'gradient-primary' },
    { id: 2, title: 'Бесплатная доставка', subtitle: 'При заказе от 1000₽', code: 'FREE1000', color: 'gradient-accent' },
  ];

  const addToCart = (dish: any) => {
    const existing = cart.find(item => item.id === dish.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === dish.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...dish, quantity: 1}]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-2xl animate-scale-in">
              🍔
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent gradient-primary">FoodExpress</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Bell" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 gradient-primary animate-scale-in">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">×{item.quantity}</p>
                          </div>
                          <p className="font-semibold">{item.price * item.quantity}₽</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="font-semibold">Итого:</span>
                          <span className="font-bold text-xl">{cartTotal}₽</span>
                        </div>
                        <Button className="w-full gradient-primary hover:opacity-90">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Avatar className="cursor-pointer hover-scale">
              <AvatarFallback className="gradient-primary text-white">АП</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-1">
            <TabsTrigger value="home" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Home" size={20} />
              <span className="text-xs">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex flex-col items-center gap-1 py-3">
              <Icon name="UtensilsCrossed" size={20} />
              <span className="text-xs">Меню</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Package" size={20} />
              <span className="text-xs">Заказы</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Star" size={20} />
              <span className="text-xs">Отзывы</span>
            </TabsTrigger>
            <TabsTrigger value="promos" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Gift" size={20} />
              <span className="text-xs">Акции</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="gradient-primary rounded-3xl p-8 text-white relative overflow-hidden animate-fade-in">
              <div className="relative z-10">
                <Badge className="bg-white/20 text-white border-0 mb-4">🔥 Горячее предложение</Badge>
                <h2 className="text-4xl font-bold mb-3">Скидка 30% на первый заказ!</h2>
                <p className="text-lg opacity-90 mb-6">Попробуйте лучшие блюда с выгодой</p>
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Заказать сейчас
                </Button>
              </div>
              <div className="absolute right-0 top-0 text-9xl opacity-20">🍕</div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Категории</h3>
              <div className="grid grid-cols-5 gap-4">
                {categories.map(cat => (
                  <Card key={cat.id} className="p-4 text-center cursor-pointer hover-scale group">
                    <div className={`text-4xl mb-2 ${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Популярные блюда</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularDishes.map(dish => (
                  <Card key={dish.id} className="overflow-hidden group cursor-pointer animate-slide-in-up hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                      {dish.image}
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">{dish.category}</Badge>
                      <h4 className="font-bold text-lg mb-1">{dish.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{dish.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{dish.rating}</span>
                        </div>
                        <span className="text-xl font-bold">{dish.price}₽</span>
                      </div>
                      <Button 
                        onClick={() => addToCart(dish)}
                        className="w-full mt-3 gradient-primary hover:opacity-90"
                      >
                        В корзину
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Все блюда</h3>
              <Button variant="outline" size="sm">
                <Icon name="SlidersHorizontal" size={16} className="mr-2" />
                Фильтры
              </Button>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularDishes.map(dish => (
                <Card key={dish.id} className="overflow-hidden hover-scale">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-8xl">
                    {dish.image}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-2">{dish.name}</h4>
                    <p className="text-2xl font-bold mb-3">{dish.price}₽</p>
                    <Button onClick={() => addToCart(dish)} className="w-full gradient-primary">
                      Добавить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Мои заказы</h3>
            {orders.map(order => (
              <Card key={order.id} className="p-6 hover-scale">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">Заказ #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <Badge className={order.status === 'delivered' ? 'bg-green-500' : 'gradient-primary'}>
                    {order.status === 'delivered' ? '✓ Доставлен' : '🔥 Готовится'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{order.items} позиций</p>
                  <p className="font-bold text-xl">{order.total}₽</p>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Отзывы</h3>
            {reviews.map(review => (
              <Card key={review.id} className="p-6 animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="gradient-primary text-white">
                        {review.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({length: review.rating}).map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="promos" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Актуальные акции</h3>
            {promos.map(promo => (
              <Card key={promo.id} className={`p-8 ${promo.color} text-white relative overflow-hidden hover-scale`}>
                <Badge className="bg-white/20 text-white border-0 mb-3">{promo.code}</Badge>
                <h4 className="text-3xl font-bold mb-2">{promo.title}</h4>
                <p className="text-lg opacity-90 mb-4">{promo.subtitle}</p>
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  Применить промокод
                </Button>
                <div className="absolute right-4 top-4 text-7xl opacity-20">🎁</div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
