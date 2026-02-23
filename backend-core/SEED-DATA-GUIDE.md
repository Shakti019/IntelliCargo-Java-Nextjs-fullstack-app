# Seed Data Guide - Complete Workflow Demonstration

## Overview
This seed data demonstrates the complete IntelliCargo trade workflow from request creation to delivery tracking.

## Complete Workflow Flow
1. **Trade Request Created** → Buyer creates a request for products
2. **Trade Offer Submitted** → Seller submits an offer on the request
3. **Offer Accepted** → Buyer accepts the offer
4. **Trade Order Created** → System creates an order from accepted offer
5. **Payment Made** → Buyer clicks "💳 Pay Now" (order status: PROCESSING)
6. **Shipment Created** → Seller clicks "🚢 Create Shipment" (redirected to shipments page)
7. **Tracking Active** → Both parties view shipment progress with route stages
8. **Delivery Complete** → Order marked as COMPLETED

## Seed Data Summary

### Companies (3)
1. **Global Electronics Ltd** (USA) - Buyer Company
2. **Lovely Professional University** (India) - Seller Company
3. **Tech Imports Inc** (Canada) - Another Buyer

### Users (3)
| Email | Company | Role | Purpose |
|-------|---------|------|---------|
| buyer@globalelectronics.com | Global Electronics | ADMIN | Buyer operations |
| seller@lpu.edu | LPU | ADMIN | Seller operations |
| procurement@techimports.com | Tech Imports | ADMIN | Another buyer |

**Note:** Default password for all users: `password123` (update passwords in SQL before production)

### Products (3)
- Industrial Laptops (Electronics)
- LED Display Panels (Electronics)
- Network Switches (Networking)

### Trade Requests (3)
1. **Need 100 Industrial Laptops** - OPEN status, waiting for offers
2. **Bulk Order: LED Display Panels** - CONFIRMED status, has accepted offer and order
3. **Network Infrastructure Upgrade** - NEGOTIATION status, has accepted offer

### Trade Offers (3)
1. **PENDING** offer on laptop request (waiting for buyer acceptance)
2. **ACCEPTED** offer on LED panels (has order in PENDING status)
3. **ACCEPTED** offer on network switches (ready for order creation)

### Trade Orders (3)
1. **PENDING** order - Waiting for buyer payment (shows "💳 Pay Now" button)
2. **PROCESSING** order - Payment completed, waiting for seller to create shipment (shows "🚢 Create Shipment")
3. **CONFIRMED** order - Shipment created, in transit

### Shipments (2)
1. **IN_TRANSIT** - Network switches from India to Canada
   - 8 route stages (4 completed, 1 in progress, 3 pending)
   - Carrier: DHL Express
   - Tracking: SHP-DHL-20260220-001

2. **DELIVERED** - LED panels from India to USA  
   - 4 route stages (all completed)
   - Carrier: FedEx
   - Tracking: SHP-FDX-20260215-042

## How to Load Seed Data

### Option 1: Automatic Loading (Recommended for Development)

1. **Update user passwords** in `data-seed.sql`:
   ```sql
   -- Generate bcrypt hashes for 'password123'
   -- Use online tool or Spring Boot command
   -- Replace $2a$10$xyzABCDEFGH123 with actual hashes
   ```

2. **Enable SQL initialization** in `application.yml`:
   ```yaml
   spring:
     sql:
       init:
         mode: always
         data-locations: classpath:data-seed.sql
   ```

3. **Start the backend**:
   ```powershell
   cd backend-core
   ./mvnw spring-boot:run
   ```

4. **Seed data will be loaded** automatically on startup

**⚠️ WARNING:** This will DELETE all existing data and reload from scratch!

### Option 2: Manual Database Execution

1. **Connect to PostgreSQL**:
   ```powershell
   psql -h aws-1-ap-northeast-2.pooler.supabase.com -p 6543 -U postgres.hpprnmdszveyxcpcporf -d postgres
   ```

2. **Run the seed file**:
   ```sql
   \i 'C:/Users/shakti singh/OneDrive/Desktop/intelliCargo/backend-core/src/main/resources/data-seed.sql'
   ```

3. **Verify data**:
   ```sql
   SELECT COUNT(*) FROM companies; -- Should be 3
   SELECT COUNT(*) FROM users; -- Should be 3
   SELECT COUNT(*) FROM trade_requests; -- Should be 3
   SELECT COUNT(*) FROM trade_orders; -- Should be 3
   SELECT COUNT(*) FROM shipments; -- Should be 2
   ```

### Option 3: Using Spring Boot DevTools (Development Only)

Create a file `import.sql` in `src/main/resources/` (Hibernate will run it automatically when `ddl-auto: create` or `create-drop`):

```yaml
# Change in application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop  # Only for development!
```

Then rename `data-seed.sql` to `import.sql`.

## Generating Bcrypt Password Hashes

### Method 1: Using PasswordHashGenerator Utility (Recommended)

The project includes a utility class at:
`backend-core/src/main/java/com/intellicargo/core/util/PasswordHashGenerator.java`

**Run it:**
```powershell
cd backend-core
mvn compile exec:java -Dexec.mainClass="com.intellicargo.core.util.PasswordHashGenerator"
```

**Output:**
```
User 1 hash: $2a$10$... (60 characters)
User 2 hash: $2a$10$... (60 characters)
User 3 hash: $2a$10$... (60 characters)
```

Copy these hashes directly into the `data-seed.sql` file.

### Method 2: Online Tool
Visit: https://bcrypt-generator.com/
- Enter password: `password123`
- Rounds: 10
- Copy the hash (starts with `$2a$10$`)

### Method 3: Spring Boot Command
Create a simple test class:

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("password123: " + encoder.encode("password123"));
    }
}
```

Run and copy the output to the SQL file.

### Method 4: Using Maven Dependency
```powershell
# Add to pom.xml temporarily
mvn exec:java -Dexec.mainClass="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder" -Dexec.args="password123"
```

**Note:** The seed data file already contains valid bcrypt hashes for `password123`.

## Testing the Workflow

### Step 1: Login as Buyer (Company 1)
```
Email: buyer@globalelectronics.com
Password: password123
```

**What to do:**
- Go to **Dashboard → Trade Requests** → See your requests
- Go to **Marketplace** → Browse available requests from other companies
- Go to **Trade Offers** → See pending offers on your requests
- Click **Accept** on the PENDING offer → Creates order
- Go to **Trade Orders** → See PENDING order
- Click **💳 Pay Now** → Order becomes PROCESSING

### Step 2: Login as Seller (Company 2)
```
Email: seller@lpu.edu
Password: password123
```

**What to do:**
- Go to **Marketplace** → See trade requests from other companies
- Go to **Trade Offers** → Click **Submit Offer** on a request
- Fill offer details → Submit
- Go to **Trade Orders** → See PROCESSING orders
- Click **🚢 Create Shipment** → Automatically redirected to shipments page
- Fill tracking details, carrier, addresses
- Add route stages from shipments page

### Step 3: View Shipments (Both Users)
```
Either buyer or seller login
```

**What to see:**
- **Shipments Dashboard** with stats (In Transit, Pending, Delivered)
- **Filters** by status
- **Shipment cards** with tracking numbers
- **Details modal** showing route stages with timeline
- **Real-time tracking** with lat/long coordinates

## Database Schema Reference

### Primary Entities
- `companies` - Company information
- `users` - User accounts
- `user_company_roles` - Multi-company user assignments
- `products` - Product catalog
- `trade_requests` - Buy/sell requests
- `trade_offers` - Offers on requests
- `trade_orders` - Confirmed orders
- `shipments` - Logistics tracking
- `shipment_route_stages` - Multi-stage tracking

### Key Relationships
```
TradeRequest → Product (ManyToOne)
TradeRequest → Company (ManyToOne)
TradeOffer → TradeRequest (ManyToOne)
TradeOrder → TradeRequest (OneToOne)
TradeOrder → TradeOffer (OneToOne)
Shipment → TradeOrder (OneToOne)
ShipmentRouteStage → Shipment (ManyToOne)
```

## Status Enumerations

### OfferStatus
- `PENDING` - Awaiting buyer response
- `ACCEPTED` - Buyer accepted (order created)
- `REJECTED` - Buyer declined
- `COUNTERED` - Buyer countered with different terms

### OrderStatus (TradeStatus)
- `PENDING` - Order created, waiting for payment
- `PROCESSING` - Payment received, preparing shipment
- `CONFIRMED` - Shipment created, in transit
- `COMPLETED` - Delivered successfully
- `CANCELLED` - Order cancelled

### ShipmentStatus
- `PENDING` - Created, not yet picked up
- `PICKED_UP` - Collected from origin
- `IN_TRANSIT` - On the way
- `OUT_FOR_DELIVERY` - Final mile delivery
- `DELIVERED` - Successfully delivered
- `FAILED` - Delivery failed
- `CANCELLED` - Shipment cancelled
- `RETURNED` - Returned to sender

### ShipmentRouteStage.StageType (12 types)
```
ORIGIN_WAREHOUSE → WAREHOUSE_TO_PORT → PORT_OF_LOADING → 
CUSTOMS_EXPORT → SEA_TRANSPORT/AIR_TRANSPORT/ROAD_TRANSPORT/RAIL_TRANSPORT → 
PORT_OF_DISCHARGE → CUSTOMS_IMPORT → PORT_TO_WAREHOUSE → 
DESTINATION_WAREHOUSE → FINAL_DELIVERY
```

## Troubleshooting

### Issue: Seed data not loading
**Solution:** Check `application.yml` has SQL init enabled:
```yaml
spring.sql.init.mode: always
```

### Issue: Foreign key constraint errors
**Solution:** Ensure proper order in SQL file (companies → users → user_company_roles → products → trade_requests → etc.)

### Issue: UUID generation errors
**Solution:** Use PostgreSQL's `gen_random_uuid()` function or hardcode UUIDs

### Issue: Password authentication failed
**Solution:** 
1. Generate proper bcrypt hashes
2. Replace placeholder hashes in SQL file
3. Restart backend

### Issue: Data already exists error
**Solution:** Seed file starts with DELETE statements to clear existing data. If needed, comment them out.

## Customization

### Adding More Companies
```sql
INSERT INTO companies (id, name, email, country, industry, created_at, updated_at) 
VALUES (4, 'Your Company', 'info@yourcompany.com', 'Country', 'Industry', NOW(), NOW());
```

### Adding More Users
```sql
INSERT INTO users (user_id, email, password, full_name, created_at, updated_at) 
VALUES (4, 'user@yourcompany.com', '$2a$10$HASH_HERE', 'User Name', NOW(), NOW());

INSERT INTO user_company_roles (id, user_id, company_id, role, is_primary, created_at) 
VALUES (4, 4, 4, 'ADMIN', true, NOW());
```

### Adding More Products
```sql
INSERT INTO products (id, name, category, description, company_id, created_at, updated_at) 
VALUES (gen_random_uuid(), 'Product Name', 'Category', 'Description', 2, NOW(), NOW());
```

## Next Steps

1. ✅ Load seed data
2. ✅ Test login with all 3 users
3. ✅ Navigate through workflow: Request → Offer → Accept → Order → Pay → Ship
4. ✅ View shipment tracking with route stages
5. ✅ Test role-based button visibility (buyer vs seller)
6. ✅ Verify module interconnections work properly

## Production Considerations

**⚠️ BEFORE PRODUCTION:**
- [ ] Use strong, unique passwords (not 'password123')
- [ ] Remove or secure seed data files
- [ ] Set `spring.sql.init.mode: never` in production
- [ ] Use environment variables for sensitive data
- [ ] Implement proper user registration flow
- [ ] Add email verification
- [ ] Implement password reset functionality

---

**Questions?** Check the main README or API documentation files in the backend-core folder.
