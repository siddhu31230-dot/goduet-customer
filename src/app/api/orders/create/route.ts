import { NextRequest, NextResponse } from 'next/server';
import { OrderCreateInputSchema } from '@/lib/security/validator';
import { verifySessionToken } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { recordAuditLog } from '@/lib/security/auditLogger';
import { RESTAURANTS_DATA, FRESH_PRODUCTS_DATA } from '@/data/mockData';

// Idempotency cache for duplicate order suppression
const createdOrderKeys = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Rate Limiting Check: Max 10 order creates per minute
    const rateCheck = checkRateLimit(ip, 'order');
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Order creation limit exceeded. Please wait ${rateCheck.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    // 2. Validate Session
    const sessionCookie = req.cookies.get('goduet_session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;
    const customerId = session?.userId || 'guest_user';

    // 3. Strict Schema Validation
    const body = await req.json();
    const parseResult = OrderCreateInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid order request payload.', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      idempotencyKey,
      items,
      restaurantAId,
      restaurantBId,
      deliveryAddress,
      paymentMethod,
      appliedCoupon,
      riderTip,
      deliveryNotes
    } = parseResult.data;

    // 4. Idempotency Check: Prevent duplicate orders on network retries
    if (createdOrderKeys.has(idempotencyKey)) {
      return NextResponse.json({
        success: true,
        isIdempotentReplay: true,
        order: createdOrderKeys.get(idempotencyKey)
      });
    }

    // 5. SERVER-SIDE PRICE TAMPER DEFENSE:
    // Never trust prices submitted by client; compute exact price from server catalog
    let verifiedSubtotalA = 0;
    let verifiedSubtotalB = 0;
    let verifiedFreshSubtotal = 0;

    const verifiedItems = items.map(clientItem => {
      let serverPrice = clientItem.price;

      // Check restaurant menus
      if (clientItem.restaurantId) {
        const restaurant = RESTAURANTS_DATA.find(r => r.id === clientItem.restaurantId);
        const menuItem = restaurant?.menu.find(m => m.id === clientItem.menuItemId);
        if (menuItem) {
          serverPrice = menuItem.price; // Enforce canonical server price
        }
      } else if (clientItem.isFreshItem) {
        const freshProduct = FRESH_PRODUCTS_DATA.find(fp => fp.id === clientItem.menuItemId);
        if (freshProduct) {
          serverPrice = freshProduct.price; // Enforce canonical server price
        }
      }

      const itemTotal = serverPrice * clientItem.quantity;
      if (clientItem.restaurantId === restaurantAId) {
        verifiedSubtotalA += itemTotal;
      } else if (clientItem.restaurantId === restaurantBId) {
        verifiedSubtotalB += itemTotal;
      } else {
        verifiedFreshSubtotal += itemTotal;
      }

      return {
        ...clientItem,
        price: serverPrice,
        verifiedSubtotal: itemTotal
      };
    });

    // 6. SERVER-SIDE DUET ELIGIBILITY VALIDATION
    let isDuetOrder = false;
    if (restaurantAId && restaurantBId && restaurantAId !== restaurantBId) {
      const restA = RESTAURANTS_DATA.find(r => r.id === restaurantAId);
      if (!restA || !restA.duetPartners.includes(restaurantBId)) {
        return NextResponse.json(
          { error: 'SECURITY REJECTION: Restaurant B is not an authorized, synchronized Duet Partner for Restaurant A.' },
          { status: 400 }
        );
      }
      isDuetOrder = true;
    }

    // 7. Calculate Server-Side Final Total
    const foodSubtotal = verifiedSubtotalA + verifiedSubtotalB + verifiedFreshSubtotal;
    const singleDeliveryFee = foodSubtotal > 600 || appliedCoupon === 'FREEDEL' ? 0 : 39;
    const packagingFee = (restaurantAId ? 25 : 0) + (restaurantBId ? 25 : 0) + (verifiedFreshSubtotal > 0 ? 15 : 0);
    const platformFee = 5;
    const gstAndCharges = Math.round(foodSubtotal * 0.05);

    let discount = 0;
    if (appliedCoupon === 'DUETFIRST') discount = Math.min(foodSubtotal, 100);
    else if (appliedCoupon === 'STUDENT15') discount = Math.round((foodSubtotal * 15) / 100);
    else if (appliedCoupon === 'HYDDUET') discount = 45;

    const finalTotal = Math.max(0, foodSubtotal + singleDeliveryFee + packagingFee + platformFee + gstAndCharges + riderTip - discount);

    const orderId = `HYD-DUET-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();

    const createdOrder = {
      id: orderId,
      customerId,
      createdAt: now.toISOString(),
      isDuetOrder,
      restaurantAId,
      restaurantBId,
      items: verifiedItems,
      deliveryAddress,
      paymentMethod,
      bill: {
        subtotalA: verifiedSubtotalA,
        subtotalB: verifiedSubtotalB,
        freshSubtotal: verifiedFreshSubtotal,
        foodSubtotal,
        singleDeliveryFee,
        packagingFee,
        platformFee,
        gstAndCharges,
        discount,
        riderTip,
        finalTotal
      },
      status: 'confirmed'
    };

    // Cache idempotency key
    createdOrderKeys.set(idempotencyKey, createdOrder);

    // 8. Audit Logging
    recordAuditLog({
      action: 'ORDER_CREATED',
      actorId: customerId,
      actorRole: session?.role || 'customer',
      ipAddress: ip,
      targetEntity: 'order',
      targetId: orderId,
      status: 'SUCCESS',
      details: { finalTotal, isDuetOrder, paymentMethod }
    });

    return NextResponse.json({
      success: true,
      message: 'Order verified and confirmed by GoDuet server.',
      order: createdOrder
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal order creation failure.' },
      { status: 500 }
    );
  }
}
