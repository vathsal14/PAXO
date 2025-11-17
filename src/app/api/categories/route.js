import sql from "@/app/api/utils/sql";

// GET /api/categories - List all categories or filter by parent category
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentCategory = searchParams.get("parent");

    let query, params;

    if (parentCategory) {
      query = `
        SELECT * FROM categories 
        WHERE parent_category = $1 
        ORDER BY name ASC
      `;
      params = [parentCategory];
    } else {
      query = `
        SELECT * FROM categories 
        ORDER BY parent_category ASC, name ASC
      `;
      params = [];
    }

    const categories = await sql(query, params);

    return Response.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, image_url, parent_category } = body;

    if (!name || !slug || !parent_category) {
      return Response.json(
        { error: "Name, slug, and parent category are required" },
        { status: 400 },
      );
    }

    const result = await sql(
      `
      INSERT INTO categories (name, slug, description, image_url, parent_category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [name, slug, description, image_url, parent_category],
    );

    return Response.json({ category: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.code === "23505") {
      // Unique violation
      return Response.json(
        { error: "Category slug already exists" },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
