import { authenticate } from "../shopify.server";

export async function action({ request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const body = await request.json();

    // Save to MongoDB
    const mongoResponse = await fetch(
      "http://localhost:5000/api/announcement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const mongoResult = await mongoResponse.json();

    // Get Shop ID
    const shopResponse = await admin.graphql(`
      query {
        shop {
          id
        }
      }
    `);

    const shopJson = await shopResponse.json();

    const shopId = shopJson.data.shop.id;

    console.log("Shop ID:", shopId);

    // Save Announcement to Shopify Metafield
    const metafieldResponse = await admin.graphql(
      `
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "my_app",
              key: "announcement",
              type: "single_line_text_field",
              value: body.text,
            },
          ],
        },
      },
    );

    const metafieldResult = await metafieldResponse.json();

    console.log("Metafield Result:", JSON.stringify(metafieldResult, null, 2));

    return Response.json({
      success: true,
      mongo: mongoResult,
      metafield: metafieldResult,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
