-- Place an order and reserve its stock in one transaction.
-- Run with Supabase migrations or paste into the Supabase SQL editor.
-- Remove the older parameter-order overload if it was deployed previously.
DROP FUNCTION IF EXISTS public.place_order(TEXT, TEXT, JSONB, TEXT, NUMERIC);

CREATE OR REPLACE FUNCTION public.place_order_atomic_v2(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_total_amount NUMERIC,
  p_items JSONB,
  p_status TEXT DEFAULT 'Pending'
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item JSONB;
  medicine_id TEXT;
  requested_quantity INTEGER;
  current_stock INTEGER;
  saved_order public.orders;
BEGIN
  IF jsonb_typeof(p_items) <> 'object' OR jsonb_typeof(p_items->'cart') <> 'array' THEN
    RAISE EXCEPTION 'Invalid order items';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(p_items->'cart') LOOP
    medicine_id := NULLIF(item->>'id', '');
    requested_quantity := (item->>'quantity')::INTEGER;

    IF medicine_id IS NULL OR requested_quantity IS NULL OR requested_quantity < 1 THEN
      RAISE EXCEPTION 'Invalid order item';
    END IF;

    SELECT stock INTO current_stock
    FROM public.medicines
    WHERE id::TEXT = medicine_id
    FOR UPDATE;

    IF NOT FOUND OR current_stock < requested_quantity THEN
      RAISE EXCEPTION 'Insufficient stock for %', COALESCE(item->>'name', medicine_id);
    END IF;

    UPDATE public.medicines
    SET stock = current_stock - requested_quantity
    WHERE id::TEXT = medicine_id;
  END LOOP;

  INSERT INTO public.orders (customer_name, customer_email, total_amount, items, status)
  VALUES (p_customer_name, NULLIF(p_customer_email, ''), p_total_amount, p_items, p_status)
  RETURNING * INTO saved_order;

  RETURN saved_order;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order_atomic_v2(TEXT, TEXT, NUMERIC, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order_atomic_v2(TEXT, TEXT, NUMERIC, JSONB, TEXT) TO anon, authenticated;

-- Track only the order matching both supplied values; never expose all orders to the browser.
CREATE OR REPLACE FUNCTION public.track_order(p_tracking_code TEXT, p_phone TEXT)
RETURNS SETOF public.orders
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.*
  FROM public.orders AS o
  WHERE UPPER(COALESCE(o.items->'shipping'->>'tracking_code', o.id::TEXT)) = UPPER(p_tracking_code)
    AND regexp_replace(COALESCE(o.items->'shipping'->>'phone', ''), '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g')
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_order(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_order(TEXT, TEXT) TO anon, authenticated;

-- Remove legacy broad policies before applying least-privilege access rules.
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('orders', 'medicines')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_row.policyname, policy_row.tablename);
  END LOOP;
END;
$$;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.orders FROM anon;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;

CREATE POLICY "Admins manage orders"
  ON public.orders FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Customers view their own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (customer_email = (auth.jwt() ->> 'email'));

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.medicines TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.medicines TO authenticated;

CREATE POLICY "Anyone can view medicines"
  ON public.medicines FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins insert medicines"
  ON public.medicines FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins update medicines"
  ON public.medicines FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins delete medicines"
  ON public.medicines FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');