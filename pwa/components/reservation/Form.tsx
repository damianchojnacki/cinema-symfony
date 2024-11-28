import { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from '@tanstack/react-query';

import { fetch, FetchError, FetchResponse } from "@/utils/dataAccess";
import { Reservation } from "@/types/Reservation";

interface Props {
  reservation?: Reservation;
}

interface SaveParams {
  values: Reservation;
}

interface DeleteParams {
  id: string;
}

const saveReservation = async ({ values }: SaveParams) =>
  await fetch<Reservation>(!values["@id"] ? "/reservations" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });


export const Form: FunctionComponent<Props> = ({ reservation }) => {
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Reservation> | undefined,
    Error | FetchError,
    SaveParams
  >({
    mutationFn: (saveParams) => saveReservation(saveParams)
  });

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/reservations"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {reservation
          ? `Edit Reservation ${reservation["@id"]}`
          : `Create Reservation`}
      </h1>
      <Formik
        initialValues={
          reservation
            ? {
                ...reservation,
              }
            : new Reservation()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/reservations");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="reservation_seats"
              >
                seats
              </label>
              <input
                name="seats"
                id="reservation_seats"
                value={values.seats ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.seats && touched.seats ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.seats && touched.seats ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="seats"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="reservation_email"
              >
                email
              </label>
              <input
                name="email"
                id="reservation_email"
                value={values.email ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.email && touched.email ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="email"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="reservation_total"
              >
                total
              </label>
              <input
                name="total"
                id="reservation_total"
                value={values.total ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.total && touched.total ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.total && touched.total ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="total"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="reservation_token"
              >
                token
              </label>
              <input
                name="token"
                id="reservation_token"
                value={values.token ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.token && touched.token ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.token && touched.token ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="token"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="reservation_showing"
              >
                showing
              </label>
              <input
                name="showing"
                id="reservation_showing"
                value={values.showing ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.showing && touched.showing ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.showing && touched.showing ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="showing"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};
