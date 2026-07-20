import { useEffect } from "react";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();

  useEffect(() => {
    //joga o usuário para a tela de login assim que ele abrir o app
    router.replace("/autenticacao/login");
  }, []);

  return null;
}