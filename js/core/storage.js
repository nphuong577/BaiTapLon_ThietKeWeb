const KEYS = {
  cart: "farmy_cart_v1",
  users: "farmy_users_v1",
  session: "farmy_session_v1",
  orders: "farmy_orders_v1"
};

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getCart: () => read(KEYS.cart, []),
  setCart: (cart) => write(KEYS.cart, cart),
  getUsers: () => read(KEYS.users, []),
  setUsers: (users) => write(KEYS.users, users),
  getSession: () => read(KEYS.session, null),
  setSession: (session) => write(KEYS.session, session),
  clearSession: () => localStorage.removeItem(KEYS.session),
  getOrders: () => read(KEYS.orders, []),
  setOrders: (orders) => write(KEYS.orders, orders)
};

export function createCartKey(item) {
  return [item.productId, item.sizeId, item.spice, item.drinkId].join("|");
}
