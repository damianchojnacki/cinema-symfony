import { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { getItemPath } from "@/utils/dataAccess";
import { Showing } from "@/types/Showing";
import {routes} from "@/lib/routes";
import {Movie} from "@/types/Movie";

interface Props {
  movie: Movie;
  text: string;
  showings: Showing[]
}

export const Show: FunctionComponent<Props> = ({ showing, text }) => {
  const {query: {id: movieId}} = useRouter()

  return (
    <div className="p-4">
      <Head>
        <title>{`Show Showing ${showing["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <Link
        href={routes.getMoviePath(movieId as string)}
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {"< Back to list"}
      </Link>
      <h1 className="text-3xl mb-2">{`Show Showing ${showing["@id"]}`}</h1>
      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          <tr>
            <th scope="row">starts_at</th>
            <td>{showing["starts_at"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">rows</th>
            <td>{showing["rows"]}</td>
          </tr>
          <tr>
            <th scope="row">columns</th>
            <td>{showing["columns"]}</td>
          </tr>
          <tr>
            <th scope="row">movie</th>
          </tr>
          <tr>
            <th scope="row">reservations</th>
            <td>{showing["reservations"]}</td>
          </tr>
          <tr>
            <th scope="row">seats_taken</th>
            <td>{showing["seats_taken"]}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link
          href={getItemPath(showing["@id"], "/showings/[id]/edit")}
          className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};
