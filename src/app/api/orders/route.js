import sql from "@/app/api/utils/sql";

// GET /api/orders - List all orders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = `
      SELECT o.*, 
        COUNT(oi.id) as item_count,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const queryParams = [];

    if (status) {
      query += ` WHERE o.order_status = $1`;
      queryParams.push(status);
    }

    query += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const orders = await sql(query, queryParams);

    return Response.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Create new order
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      restaurant_name,
      contact_person,
      email,
      phone,
      delivery_address,
      special_instructions,
      items,
      payment_method,
    } = body;

    if (
      !restaurant_name ||
      !contact_person ||
      !email ||
      !phone ||
      !delivery_address ||
      !items ||
      items.length === 0
    ) {
      return Response.json(
        {
          error:
            "Restaurant name, contact person, email, phone, delivery address, and items are required",
        },
        { status: 400 },
      );
    }

    // Generate order number
    const orderNumber = `PAXO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += parseFloat(item.subtotal);
    }

    const shippingCost = 0; // Free shipping or calculate based on logic
    const total = subtotal + shippingCost;

    // Start transaction to create order and order items
    const result = await sql.transaction(async (txn) => {
      // Create order
      const orderResult = await txn(
        `
        INSERT INTO orders (
          order_number, restaurant_name, contact_person, email, phone,
          delivery_address, special_instructions, subtotal, shipping_cost, 
          total, payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `,
        [
          orderNumber,
          restaurant_name,
          contact_person,
          email,
          phone,
          delivery_address,
          special_instructions,
          subtotal,
          shippingCost,
          total,
          payment_method,
        ],
      );

      const order = orderResult[0];

      // Create order items
      const orderItems = [];
      for (const item of items) {
        const itemResult = await txn(
          `
          INSERT INTO order_items (
            order_id, product_id, product_name, quantity, unit_price, subtotal
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `,
          [
            order.id,
            item.product_id,
            item.product_name,
            item.quantity,
            item.unit_price,
            item.subtotal,
          ],
        );
        orderItems.push(itemResult[0]);
      }

      return { order, orderItems };
    });

    return Response.json(
      {
        order: result.order,
        items: result.orderItems,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
