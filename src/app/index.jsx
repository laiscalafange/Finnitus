
 import { useRouter } from "expo-router";
import { useEffect } from "react";


export default function Index() {
  const router = useRouter();

  useEffect(() => {
    //joga o usuário para a tela de login assim que ele abrir o app
    router.replace("/onboarding/Trilhe");
  }, []);

  return null;
}

/*import TestComponents from "./testcomponents";

export default function Index() {
  return <TestComponents />;
}
*/
