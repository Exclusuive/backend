import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function getLayerImageUrls(
  baseObjectId: string
): Promise<string[]> {
  const dynamicFields = await client.getDynamicFields({
    parentId: baseObjectId,
  });
  const objectIds = dynamicFields.data.map((f) => f.objectId);

  const objects = await client.multiGetObjects({
    ids: objectIds,
    options: { showContent: true },
  });

  const imageUrls = objects.map((obj) => {
    try {
      return (obj.data?.content as any)?.fields?.value?.fields?.socket?.fields
        ?.img_url;
    } catch (e) {
      console.error("Failed to extract img_url:", e);
      return null;
    }
  });

  return imageUrls.filter((url): url is string => typeof url === "string");
}
