import { Redirect } from "expo-router";

import { useAuth } from "../features/authContext";

export default function Index() {
  const { user, senhaRedefinida } = useAuth();

  if (!user) {
    if (senhaRedefinida) {
      return <Redirect href={{ pathname: "/login", params: { redefinida: "1" } }} />;
    }

    return <Redirect href="/inicie" />;
  }

  return <Redirect href="/paginaInicial" />;
}
