-- Seed cars data
INSERT INTO cars (name, brand, model, year, category, price_per_day, image_url, seats, transmission, fuel_type, available, features) VALUES
  ('Toyota Corolla', 'Toyota', 'Corolla', 2024, 'economy', 45.00, 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800', 5, 'automatic', 'petrol', true, ARRAY['Bluetooth', 'Backup Camera', 'USB Port']),
  ('Honda Civic', 'Honda', 'Civic', 2024, 'compact', 55.00, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 5, 'automatic', 'petrol', true, ARRAY['Apple CarPlay', 'Android Auto', 'Lane Assist']),
  ('BMW 3 Series', 'BMW', 'M340i', 2024, 'luxury', 120.00, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 5, 'automatic', 'petrol', true, ARRAY['Leather Seats', 'Sunroof', 'Premium Sound', 'Navigation']),
  ('Tesla Model 3', 'Tesla', 'Model 3', 2024, 'luxury', 95.00, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 5, 'automatic', 'electric', true, ARRAY['Autopilot', 'Premium Interior', 'Glass Roof']),
  ('Ford Müstang', 'Ford', 'Müstang GT', 2024, 'sports', 150.00, 'https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=800', 4, 'manual', 'petrol', true, ARRAY['V8 Engine', 'Sport Mode', 'Premium Audio']),
  ('Jeep Wrangler', 'Jeep', 'Wrangler', 2024, 'suv', 85.00, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 5, 'automatic', 'petrol', true, ARRAY['4WD', 'Removable Top', 'Off-Road Package']),
  ('Mercedes C-Class', 'Mercedes', 'C300', 2024, 'luxury', 135.00, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 5, 'automatic', 'petrol', true, ARRAY['MBUX', 'Ambient Lighting', 'Heated Seats']),
  ('Toyota RAV4', 'Toyota', 'RAV4', 2024, 'suv', 75.00, 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800', 5, 'automatic', 'hybrid', true, ARRAY['AWD', 'Safety Sense', 'Wireless Charging']),
  ('Chevrolet Tahoe', 'Chevrolet', 'Tahoe', 2024, 'van', 110.00, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 8, 'automatic', 'petrol', true, ARRAY['Third Row', 'Towing Package', 'Rear Entertainment']),
  ('Porsche 911', 'Porsche', '911 Carrera', 2024, 'sports', 250.00, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800', 2, 'automatic', 'petrol', true, ARRAY['Sport Chrono', 'PASM', 'Bose Sound']),
  ('Audi Q5', 'Audi', 'Q5', 2024, 'suv', 90.00, 'https://images.unsplash.com/photo-1606664513152-a09ef2225fca?w=800', 5, 'automatic', 'petrol', true, ARRAY['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen']),
  ('Volkswagen Golf', 'Volkswagen', 'Golf GTI', 2024, 'compact', 65.00, 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800', 5, 'manual', 'petrol', true, ARRAY['Sport Suspension', 'Digital Cockpit', 'Performance Brakes']);

-- Create trigger for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
