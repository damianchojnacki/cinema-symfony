import {
  GetServerSideProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

import { Show } from "@/components/showing/Show";
import { Showing } from "@/types/Showing";
import { FetchResponse } from "@/utils/dataAccess";
import { useMercure } from "@/utils/mercure";
import {getShowing, getShowingPath} from "@/lib/api/showings";

const Page: NextComponentType = () => {
  const router = useRouter();
  const { showingId } = router.query;

  const { data: { data: showing, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Showing> | undefined>({
      queryKey: ["showing", showingId],
      queryFn: () => getShowing(showingId)
    });

  const showingData = useMercure(showing, hubURL);

  if (!showingData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Showing ${showingData["@id"]}`}</title>
        </Head>
      </div>
      <Show showing={showingData} text={text} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id || !params?.showingId) {
    return {
      notFound: true,
    }
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [getShowingPath(params.showingId)],
    queryFn: () => getShowing(params.showingId)
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page
