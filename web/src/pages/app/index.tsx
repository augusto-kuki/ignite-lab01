import { getSession, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import React from "react";

export default function Home() {
  const { user } = useUser();
  const session = getSession();
  return (
    <div>
      <h1>Hello World</h1>

      {console.log()}

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
