import { Redirect } from "expo-router";

import { useAuth } from "../features/authContext";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/inicie" />;
  }

  if (!user.profileComplete) {
    return <Redirect href="/conta/editar" />;
  }

  return <Redirect href="/paginaInicial" />;
}