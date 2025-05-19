import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function getLayerImageUrls(
  baseObjectId: string,
  collectionId: string
): Promise<string[]> {
  const dynamicFields = await client.getDynamicFields({
    parentId: baseObjectId,
  });
  const objectIds = dynamicFields.data.map((f) => f.objectId);

  const objects = await client.multiGetObjects({
    ids: [collectionId, ...objectIds],
    options: { showContent: true },
  });
  const content = (objects[0].data?.content as any)?.fields;
  const layerTypes = content.layer_types.fields.contents.map(
    (entry) => entry.fields.type
  );

  const imageUrls = objects
    .map((obj) => {
      try {
        console.log(obj.data?.content);
        const layer = (obj.data?.content as any)?.fields?.value?.fields?.socket
          ?.fields.type?.fields?.type;
        const imgUrl = (obj.data?.content as any)?.fields?.value?.fields?.socket
          ?.fields?.img_url;

        console.log(layer, imgUrl);
        return { layer, imgUrl };
      } catch (e) {
        console.error("Failed to extract img_url:", e);
        return null;
      }
    })
    .filter((url): url is { layer: string; imgUrl: string } => url !== null);

  const orderedImageUrls = layerTypes
    .map((layerType) => {
      const found = imageUrls.find((image) => image.layer === layerType);
      return found ? found.imgUrl : null;
    })
    .filter((url) => url !== null);

  return orderedImageUrls;
}
