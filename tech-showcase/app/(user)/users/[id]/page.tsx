import React from "react";
import UserDetail from "./UserDetail";

type Params = {
  params: {
    id: number;
  };
};

export default async function Index({ params: { id } }: Params) {
  return <UserDetail id={id} />;
}
