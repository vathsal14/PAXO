import sql from "@/app/api/utils/sql";

// GET /api/products/[id] - Get single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await sql(
      `
      SELECT p.*, c.name as category_name, c.parent_category, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.in_stock = true
    `,
      [id],
    );

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    const allowedFields = [
      "name",
      "slug",
      "description",
      "specifications",
      "price",
      "unit",
      "pack_quantity",
      "sku",
      "image_url",
      "additional_images",
      "category_id",
      "in_stock",
      "bulk_pricing",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        paramCount++;
        updateFields.push(`${field} = $${paramCount}`);

        if (field === "bulk_pricing" && body[field]) {
          updateValues.push(JSON.stringify(body[field]));
        } else {
          updateValues.push(body[field]);
        }
      }
    });

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add updated_at field
    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    updateValues.push(new Date().toISOString());

    // Add ID for WHERE clause
    paramCount++;
    updateValues.push(id);

    const query = `
      UPDATE products 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, updateValues);

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Update category product count if category changed
    if (body.category_id) {
      await sql(
        `
        UPDATE categories 
        SET product_count = (SELECT COUNT(*) FROM products WHERE category_id = categories.id)
        WHERE id IN ($1, (SELECT category_id FROM products WHERE id = $2))
      `,
        [body.category_id, id],
      );
    }

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === "23505") {
      // Unique violation
      return Response.json(
        { error: "Product slug or SKU already exists" },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Get product details first for category update
    const productResult = await sql(
      `
      SELECT category_id FROM products WHERE id = $1
    `,
      [id],
    );

    if (productResult.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const categoryId = productResult[0].category_id;

    // Delete product
    const result = await sql(
      `
      DELETE FROM products WHERE id = $1 RETURNING *
    `,
      [id],
    );

    // Update category product count
    if (categoryId) {
      await sql(
        `
        UPDATE categories 
        SET product_count = (SELECT COUNT(*) FROM products WHERE category_id = $1)
        WHERE id = $1
      `,
        [categoryId],
      );
    }

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
