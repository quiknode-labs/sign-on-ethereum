import { db } from "~/utils/db.server";
import {
  LoaderFunction,
  useLoaderData,
} from "remix";
import { User } from "@prisma/client";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({
  params,
}) => {
  invariant(
    params.userId,
    "expected params.userId to exist"
  );
  const user = await db.user.findUnique({
    where: {
      address: params.userId,
    },
  });
  if (!user) return null;
  return user;
};

export default function userPage() {
  const user = useLoaderData<User>();
  return (
    <div>
      <h1>gm</h1>
      <p>{user.address}</p>
    </div>
  );
}

export function ErrorBoundary({
  error,
}: {
  error: any;
}) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
