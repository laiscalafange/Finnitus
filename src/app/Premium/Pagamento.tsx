import { Redirect } from "expo-router";
import { Rotas } from "../../shared/constants/Rotas";

export default function LegacyPremiumRoute() {
  return <Redirect href={Rotas.premium} />;
}
