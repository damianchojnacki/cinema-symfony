import { FunctionComponent } from "react";
import Link from "next/link";
import Head from "next/head";

import { getItemPath } from "@/utils/dataAccess";
import { Reservation } from "@/types/Reservation";

interface Props {
  reservation: Reservation;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ reservation, text }) => {
  return (
    <div className="p-4">
      <Head>
        <title>{`Show Reservation ${reservation["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <Link
        href="/reservations"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {"< Back to list"}
      </Link>
      <h1 className="text-3xl mb-2">{`Show Reservation ${reservation["@id"]}`}</h1>
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
            <th scope="row">seats</th>
            <td>{reservation["seats"]}</td>
          </tr>
          <tr>
            <th scope="row">email</th>
            <td>{reservation["email"]}</td>
          </tr>
          <tr>
            <th scope="row">total</th>
            <td>{reservation["total"]}</td>
          </tr>
          <tr>
            <th scope="row">token</th>
            <td>{reservation["token"]}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link
          href={getItemPath(reservation["@id"], "/reservations/[id]/edit")}
          className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};
