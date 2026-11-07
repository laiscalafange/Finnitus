import { createElement } from "react";

/**
 * Expo Web: reproduz as cores e posicoes do gradiente SVG original.
 * O fallback CSS evita falhas de renderizacao de RadialGradient no navegador.
 * O elemento e decorativo, ocupa a tela inteira e nao intercepta cliques.
 */
export function AuthBackground() {
  return createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      backgroundColor: "#09090B",
      backgroundImage: [
        "radial-gradient(ellipse 55% 55% at 85% 10%, rgba(198, 255, 52, 0.30) 0%, rgba(183, 255, 0, 0) 100%)",
        "radial-gradient(ellipse 55% 60% at 10% 90%, rgba(70, 38, 128, 0.40) 0%, rgba(126, 59, 237, 0) 100%)",
      ].join(", "),
    },
  });
}
