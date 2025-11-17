import sql from "@/app/api/utils/sql";

// GET /api/products - List all products with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sort_by") || "name";
    const sortOrder = searchParams.get("sort_order") || "ASC";

    let baseQuery = `
      SELECT p.*, c.name as category_name, c.parent_category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.in_stock = true
    `;

    const queryParams = [];
    let paramCount = 0;

    if (categoryId) {
      paramCount++;
      baseQuery += ` AND p.category_id = $${paramCount}`;
      queryParams.push(categoryId);
    }

    if (search) {
      paramCount++;
      baseQuery += ` AND (LOWER(p.name) LIKE LOWER($${paramCount}) OR LOWER(p.description) LIKE LOWER($${paramCount}))`;
      queryParams.push(`%${search}%`);
    }

    // Add sorting
    const allowedSortFields = ["name", "price", "created_at"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    baseQuery += ` ORDER BY p.${sortField} ${order}`;

    const products = await sql(baseQuery, queryParams);

    return Response.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST /api/products - Create new product
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      specifications,
      price,
      unit,
      pack_quantity,
      sku,
      image_url,
      additional_images,
      category_id,
      bulk_pricing,
    } = body;

    if (!name || !slug || !price || !category_id) {
      return Response.json(
        {
          error: "Name, slug, price, and category are required",
        },
        { status: 400 },
      );
    }

    const result = await sql(
      `
      INSERT INTO products (
        name, slug, description, specifications, price, unit,
        pack_quantity, sku, image_url, additional_images, 
        category_id, bulk_pricing
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `,
      [
        name,
        slug,
        description,
        specifications,
        price,
        unit || "piece",
        pack_quantity || 1,
        sku,
        image_url,
        additional_images,
        category_id,
        bulk_pricing ? JSON.stringify(bulk_pricing) : null,
      ],
    );

    // Update category product count
    await sql(
      `
      UPDATE categories 
      SET product_count = (SELECT COUNT(*) FROM products WHERE category_id = $1)
      WHERE id = $1
    `,
      [category_id],
    );

    return Response.json({ product: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === "23505") {
      // Unique violation
      return Response.json(
        { error: "Product slug or SKU already exists" },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
