// ============================================================================
// db.js — Single seam between the UI and Supabase.
//
// Every screen calls these functions; no screen talks to Supabase directly.
// This means we can swap providers later by editing one file, and we can
// type-check / log / mock things in one place.
// ============================================================================
import { supabase } from './supabase';

// ---------- Profiles --------------------------------------------------------
export const profilesApi = {
  async getMe() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listModerators() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'moderator')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async listAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
    if (error) throw error;
    return data;
  },

  async assignModeratorToProperty(profileId, propertyId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ assigned_property_id: propertyId, role: 'moderator' })
      .eq('id', profileId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async promoteToRole(profileId, role) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', profileId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ---------- Properties ------------------------------------------------------
export const propertiesApi = {
  async list() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('properties')
      .insert({ ...input, created_by: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from('properties')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---------- Suites ----------------------------------------------------------
export const suitesApi = {
  async list({ propertyId } = {}) {
    let q = supabase.from('suites').select('*, properties(short_name, name)').order('price');
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data, error } = await supabase.from('suites').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, patch) {
    const { data, error } = await supabase.from('suites').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('suites').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---------- Reservations ----------------------------------------------------
export const reservationsApi = {
  async list({ propertyId, guestId, monthStart, monthEnd } = {}) {
    let q = supabase.from('reservations').select('*').order('check_in', { ascending: true });
    if (propertyId) q = q.eq('property_id', propertyId);
    if (guestId) q = q.eq('guest_id', guestId);
    if (monthStart) q = q.gte('check_in', monthStart);
    if (monthEnd) q = q.lte('check_in', monthEnd);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async listActiveGuests({ propertyId } = {}) {
    let q = supabase
      .from('reservations')
      .select('*')
      .in('status', ['confirmed', 'checked-in', 'arriving', 'departing', 'overdue']);
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data, error } = await supabase.from('reservations').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ---------- Messages --------------------------------------------------------
export const messagesApi = {
  async list({ propertyId } = {}) {
    let q = supabase.from('messages').select('*').is('parent_id', null).order('created_at', { ascending: false });
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async listReplies(parentId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async send(input) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('messages')
      .insert({ ...input, sender_id: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markRead(id) {
    const { data, error } = await supabase
      .from('messages')
      .update({ unread: false })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ---------- Tasks -----------------------------------------------------------
export const tasksApi = {
  async list({ propertyId } = {}) {
    let q = supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, created_by: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---------- Inventory -------------------------------------------------------
export const inventoryApi = {
  async list({ propertyId } = {}) {
    let q = supabase.from('inventory').select('*').order('name');
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data, error } = await supabase.from('inventory').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  async adjust(id, delta) {
    // Read-modify-write. RLS already restricts which property's row this can
    // touch. Concurrency is acceptable for inventory in a hospitality demo.
    const { data: row, error: e1 } = await supabase
      .from('inventory')
      .select('stock, max_stock')
      .eq('id', id)
      .single();
    if (e1) throw e1;
    const next = Math.max(0, Math.min(row.max_stock, row.stock + delta));
    const { data, error } = await supabase
      .from('inventory')
      .update({ stock: next })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---------- Menu Items ------------------------------------------------------
export const menuApi = {
  async list({ propertyId } = {}) {
    let q = supabase.from('menu_items').select('*').eq('available', true).order('category');
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data, error } = await supabase.from('menu_items').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---------- Orders ----------------------------------------------------------
export const ordersApi = {
  async list({ propertyId, guestId } = {}) {
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (propertyId) q = q.eq('property_id', propertyId);
    if (guestId) q = q.eq('guest_id', guestId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data, error } = await supabase.from('orders').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ---------- Expenses --------------------------------------------------------
export const expensesApi = {
  async list({ propertyId } = {}) {
    let q = supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (propertyId) q = q.eq('property_id', propertyId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...input, created_by: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---------- Wallet ----------------------------------------------------------
export const walletApi = {
  async listTransactions(guestId) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  },

  async addCredit(guestId, amount, label, refType = 'topup') {
    // 1. record txn
    const { error: txErr } = await supabase
      .from('wallet_transactions')
      .insert({ guest_id: guestId, amount, label, reference_type: refType });
    if (txErr) throw txErr;

    // 2. recompute balance from sum (single source of truth)
    return this.recomputeBalance(guestId);
  },

  async chargeCredit(guestId, amount, label, refType = 'order', refId = null) {
    if (amount <= 0) throw new Error('Charge amount must be positive');
    const { error: txErr } = await supabase.from('wallet_transactions').insert({
      guest_id: guestId,
      amount: -amount,
      label,
      reference_type: refType,
      reference_id: refId,
    });
    if (txErr) throw txErr;
    return this.recomputeBalance(guestId);
  },

  async recomputeBalance(guestId) {
    const { data: rows, error } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('guest_id', guestId);
    if (error) throw error;
    const balance = rows.reduce((s, r) => s + Number(r.amount), 0);
    await supabase.from('profiles').update({ credit_balance: balance }).eq('id', guestId);
    return balance;
  },
};

// ---------- Promo Codes -----------------------------------------------------
export const promoApi = {
  async redeem(code, guestId) {
    const c = code.trim().toUpperCase();
    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', c)
      .eq('active', true)
      .single();
    if (error || !promo) throw new Error('Invalid or expired code');
    if (promo.expires_at && new Date(promo.expires_at) < new Date())
      throw new Error('Code expired');
    if (promo.uses >= promo.max_uses) throw new Error('Code fully redeemed');

    await supabase.from('promo_codes').update({ uses: promo.uses + 1 }).eq('id', promo.id);
    await walletApi.addCredit(guestId, promo.bonus_amount, `Promo: ${promo.code}`, 'promo');
    return promo.bonus_amount;
  },
};

// ---------- Storage ---------------------------------------------------------
export const storageApi = {
  async uploadImage(bucket, file) {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return pub.publicUrl;
  },
};
