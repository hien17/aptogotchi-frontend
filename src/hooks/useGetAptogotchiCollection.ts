import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { queryAptogotchiCollection } from "@/graphql/queryAptogotchiCollection";
import { padAddressIfNeeded } from "@/utils/address";
import { getAptosClient } from "@/utils/aptosClient";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { useCallback, useState } from "react";

const aptosClient = getAptosClient();

type Collection = {
  collection_id: string;
  collection_name: string;
  creator_address: string;
  uri: string;
  current_supply: any;
};

type CollectionHolder = {
  owner_address: string;
};

type CollectionResponse = {
  current_collections_v2: Collection[];
  current_collection_ownership_v2_view: CollectionHolder[];
};

export function useGetAptogotchiCollection() {
  const { keylessAccount } = useKeylessAccount();
  const [collection, setCollection] = useState<Collection>();
  const [firstFewAptogotchiName, setFirstFewAptogotchiName] =
    useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCollection = useCallback(async () => {
    if (!keylessAccount) return;

    try {
      setLoading(true);

      const aptogotchiCollectionAddressResponse = (await aptosClient.view({
        payload: {
          function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_address`,
        },
      })) as [`0x${string}`];

      const collectionAddress = padAddressIfNeeded(
        aptogotchiCollectionAddressResponse[0]
      );

      const collectionResponse: CollectionResponse =
        await aptosClient.queryIndexer({
          query: {
            query: queryAptogotchiCollection,
            variables: {
              collection_id: collectionAddress,
            },
          },
        });

      const firstFewAptogotchi = await Promise.all(
        collectionResponse.current_collection_ownership_v2_view
          .filter(
            (holder) =>
              holder.owner_address !== keylessAccount.accountAddress.toString()
          )
          // limit 5 in gql after indexer fix limit
          .slice(0, 5)
          .map((holder) =>
            aptosClient.view({
              payload: {
                function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
                functionArguments: [holder.owner_address],
              },
            })
          )
      );

      setCollection(collectionResponse.current_collections_v2[0]);
      setFirstFewAptogotchiName(firstFewAptogotchi.map((x) => x[0] as string));
    } catch (error) {
      console.error("Error fetching Aptogotchi collection", error);
    } finally {
      setLoading(false);
    }
  }, [keylessAccount]);

  return { collection, firstFewAptogotchiName, loading, fetchCollection };
}
