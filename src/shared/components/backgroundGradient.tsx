import Svg, {Defs, RadialGradient, Stop, Rect,} from "react-native-svg";


// variante "padrao": fundo original (Premium, Metas, Home, onboarding...).
// variante "funcional": fundo das telas funcionais (formulários, listas,
// detalhes, modais). Preto/carvão com um gradiente roxo e verde bem suave só
// nos cantos, deixando o centro livre pra leitura. Sem linhas, grades ou padrões.
type BackgroundGradientProps = {
  variante?: "padrao" | "funcional";
};

export function BackgroundGradient({ variante = "padrao" }: BackgroundGradientProps) {
  if (variante === "funcional") {
    return (
      <Svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Defs>
          {/* Roxo da marca (#420090) no canto superior esquerdo */}
          <RadialGradient id="funcionalRoxoTopo" cx="0%" cy="0%" r="75%">
            <Stop offset="0%" stopColor="#420090" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#420090" stopOpacity="0" />
          </RadialGradient>

          {/* Roxo mais fraco no canto inferior esquerdo, pra não ficar só um lado */}
          <RadialGradient id="funcionalRoxoBase" cx="0%" cy="100%" r="55%">
            <Stop offset="0%" stopColor="#420090" stopOpacity="0.28" />
            <Stop offset="100%" stopColor="#420090" stopOpacity="0" />
          </RadialGradient>

          {/* Verde-limão (#B7FF00) bem discreto no canto inferior direito */}
          <RadialGradient id="funcionalVerde" cx="100%" cy="100%" r="55%">
            <Stop offset="0%" stopColor="#b7ff0018" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#B7FF00" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base preto/carvão do Finnitus */}
        <Rect width="100%" height="100%" fill="#0C130E" />
        <Rect width="100%" height="100%" fill="url(#funcionalRoxoTopo)" />
        <Rect width="100%" height="100%" fill="url(#funcionalRoxoBase)" />
        <Rect width="100%" height="100%" fill="url(#funcionalVerde)" />
      </Svg>
    );
  }

  return (
    <Svg
  width="100%"
  height="100%"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }}
>
      <Defs>

        <RadialGradient
          id="verde"
          cx="85%" // pro lado
          cy="10%" // pra cima ou pra baixo
          r="50%"
        >
          <Stop
            offset="0%"
            stopColor="#C6FF34"
            stopOpacity="0.3"
          />
          <Stop
            offset="100%"
            stopColor="#B7FF00" 
            stopOpacity="0"
          />
        </RadialGradient>

        <RadialGradient
          id="roxo"
          cx="10%"
          cy="90%"
          r="50%"
        >
          <Stop
            offset="0%"
            stopColor="#462680" 
            stopOpacity="0.4"
          />
          <Stop
            offset="100%"
            stopColor="#7E3BED"
            stopOpacity="0"
          />
        </RadialGradient>

      </Defs>

      <Rect
        width="100%"
        height="100%"
        fill="#09090B"
      />

      <Rect
        width="100%"
        height="100%"
        fill="url(#roxo)"
      />

      <Rect
        width="100%"
        height="100%"
        fill="url(#verde)"
      />
    </Svg>
  );
}